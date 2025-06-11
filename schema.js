const Joi=require("joi");

module.exports.listingSchema=Joi.object({
    listing : Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        image:Joi.object({
            filename:Joi.string(),
            url:Joi.string().allow("",null)
        }),
        price:Joi.number().required().min(0)
    }).required()
})