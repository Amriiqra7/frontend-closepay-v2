export const removeEmptyParams = (params) => {
    if (!params) return undefined;
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
        if (
            params[key] !== null &&
            params[key] !== undefined &&
            params[key] !== ""
        ) {
            cleanParams[key] = params[key];
        }
    });
    return Object.keys(cleanParams).length ? cleanParams : undefined;
};

// Helper function untuk menambahkan properti apapun pada function
export const addProps = (fn, props) => Object.assign(fn, props);