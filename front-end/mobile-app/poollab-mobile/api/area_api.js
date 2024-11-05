import ApiManager from "./ApiManager";

export const get_all_billard_type_area= async (data) => {
    try {
        const response = await ApiManager.get(
            `/BilliardTable/GetAllBilliardTypeArea?BilliardTypeID=${data.billardtypeId}&StoreID=${data.storeId}`
           // `/BilliardTable/GetAllBilliardTypeArea8a78e8ab-2e80-4042-bf08-e205672f5464/730aca8d-e481-40cb-8658-378e71676985`
        );
        return response;
    } catch (error) {
        if (error.response) {
            // Server responded with an error status (4xx, 5xx)
            return error.response;
        } else if (error.request) {
            // Request was made but no response received
            console.log("Request error:", error.request);
            return error.request;
        } else {
            // Error occurred while setting up the request
            console.log("Error:", error.message);
            return error;
        }
    }
};