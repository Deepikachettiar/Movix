export const isAdmin = async (req, res, next) => {
    res.json({
        success: true,
        isAdmin:true
    });

}