const axios = require('axios');
const { NotFoundError, ExternalServiceError } = require('../utils/errors');

/**
 * Service to handle property data operations using the ATTOM API
 */
class PropertyService {
  constructor() {
    this.attomApiKey = process.env.ATTOM_API_KEY || '9f1f98ff1c5e9d1187f29f4d57a613fd';
  }

  /**
   * Fetch property details by address
   * @param {Object} addressInfo - Property address information
   * @param {string} addressInfo.address - Street address
   * @returns {Promise<Object>} - Normalized property details
   */
  async getPropertyDetails({ address }) {
    try {
      // Step 1: Get the attomId from the building permits endpoint
      const attomId = await this.getAttomIdFromAddress({ address });
      
      // Step 2: Get detailed property information using the attomId
      const propertyData = await this.getPropertyDetailsByAttomId(attomId);
      
      // Step 3: Normalize the data to the required format
      return this.normalizePropertyData(propertyData);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ExternalServiceError) {
        throw error;
      }
      throw new ExternalServiceError('Error fetching property data: ' + error.message);
    }
  }

  /**
   * Get the ATTOM ID for a property by address
   * @param {Object} addressInfo - Property address information
   * @param {string} addressInfo.address - Street address
   * @returns {Promise<string>} - The ATTOM ID
   */
  async getAttomIdFromAddress({ address }) {
    try {
      // 2901 Indiana Street, Dallas, Texas, EE. UU.
      //split the address into components first commas indicates the address1
      const address1= address.split(',')[0].trim();
      const address2= address.split(',')[1].trim();
      const encodedAddress1 = (address1);
      const encodedAddress2 = (address2);
      
      const response = await axios.get(
        `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/buildingpermits`, 
        {
          params: {
            address1: encodedAddress1,
            address2: encodedAddress2
          },
          headers: {
            apikey: this.attomApiKey,
            Accept: 'application/json'
          }
        }
      );

      // Check if we have a valid response with property data
      if (!response.data || 
          !response.data.property || 
          !response.data.property[0] || 
          !response.data.property[0].identifier || 
          !response.data.property[0].identifier.attomId) {
        throw new NotFoundError('Property not found in ATTOM database');
      }

      return response.data.property[0].identifier.attomId;
    } catch (error) {
      console.error('ATTOM Error (getAttomIdFromAddress):', error?.response?.data || error.message);
      
      if (error instanceof NotFoundError) {
        throw error;
      }
      
      if (error.response && error.response.status === 404) {
        throw new NotFoundError('Property not found in ATTOM database');
      }
      
      throw new ExternalServiceError('ATTOM API connection failed: ' + error.message);
    }
  }

  /**
   * Get detailed property information using an ATTOM ID
   * @param {string} attomId - The ATTOM ID for the property
   * @returns {Promise<Object>} - Raw property data from ATTOM
   */
  async getPropertyDetailsByAttomId(attomId) {
    try {
      const response = await axios.get(
        `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/detailowner`, 
        {
          params: {
            attomid: attomId
          },
          headers: {
            apikey: this.attomApiKey,
            Accept: 'application/json'
          }
        }
      );

      // Check if we have a valid response with property data
      if (!response.data || 
          !response.data.property || 
          !response.data.property[0]) {
        throw new NotFoundError('Property details not found in ATTOM database');
      }

      return response.data.property[0];
    } catch (error) {
      console.error('ATTOM Error (getPropertyDetailsByAttomId):', error?.response?.data || error.message);
      
      if (error instanceof NotFoundError) {
        throw error;
      }
      
      if (error.response && error.response.status === 404) {
        throw new NotFoundError('Property details not found in ATTOM database');
      }
      
      throw new ExternalServiceError('ATTOM API connection failed: ' + error.message);
    }
  }

  /**
   * Normalize property data from ATTOM API to the required format
   * @param {Object} propertyData - Raw property data from ATTOM API
   * @returns {Object} - Normalized property data
   */
  normalizePropertyData(propertyData) {
    const ownerFullName = propertyData.owner?.owner1?.fullname || 'Unknown';
    
    // Extract address components
    const address = propertyData.address?.oneLine || 
                   (propertyData.address?.line1 ? 
                    `${propertyData.address.line1}, ${propertyData.address.line2 || ''}` : 
                    'Unknown');
    
    // Extract building information
    const sqft = propertyData.building?.size?.universalSize || 
                propertyData.building?.size?.grosssize || 
                propertyData.building?.size?.livingsize || null;
    
    const bedrooms = propertyData.building?.rooms?.beds || null;
    
    const bathrooms = propertyData.building?.rooms?.bathstotal || 
                     (propertyData.building?.rooms?.bathsfull ? 
                      propertyData.building?.rooms?.bathsfull : null);
    
    // Extract lot size
    const lotSizeAcres = propertyData.lot?.lotsize1 || 0;
    const lotSize = `${lotSizeAcres.toFixed(2)} acres`;
    
    // Extract year built
    const yearBuilt = propertyData.summary?.yearbuilt || null;
    
    // Extract property type
    const propertyType = propertyData.summary?.propclass || 
                        propertyData.summary?.propertyType || 
                        'Unknown';
    
    // Determine if owner occupied
    const ownerOccupied = propertyData.summary?.absenteeInd ? 
                         !propertyData.summary.absenteeInd.includes('ABSENTEE') : 
                         null;
    
    return {
      owner: ownerFullName,
      address: address,
      sqft: sqft,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      lotSize: lotSize,
      yearBuilt: yearBuilt,
      propertyType: propertyType,
      ownerOccupied: ownerOccupied,
      verified: true,
      ownershipVerified: true
    };
  }
}

module.exports = PropertyService;