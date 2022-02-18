
const jsonKeys = require("../api-keys/index.json")

/* API key checker middleware */
const isValidAppKey = async (req, res, next) => {
    try {
        const key = req.headers.api_key

        if (!key) {
            return res.status(422).json({
                status: false,
                errors: {
                    api_key: "API key is required."
                }
            })
        }

        const isMatchedKey = await jsonKeys.find(item => item.key === parseInt(key))
        if (!isMatchedKey) {
            return res.status(404).json({
                status: false,
                errors: {
                    api_key: "API key isn't correct."
                }
            })
        }

        req.api_key = isMatchedKey
        next()
    } catch (error) {
        if (error) {
            res.status(5014).json({
                status: false,
                errors: {
                    message: "Something going wrong."
                }
            })
        }
    }
}

module.exports = {
    isValidAppKey
}