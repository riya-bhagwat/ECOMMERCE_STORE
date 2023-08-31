const router = require("express").Router();
const User = require("../models/User");
const {verifytoken,verifytokenandauthorization,verifytokenandadmin} = require("./verifyToken");


router.put("/:id",verifytokenandauthorization, async (req,res)=>{
   if(req.body.password){
    req.body.password=CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
   }
   try{
    const updatedUser=await User.findByIdAndUpdate(req.params.id,{
        $set: req.body
    },{
        new:true
    });
    res.status(200).json(updatedUser);
   }catch(err){
    res.status(500).json(err);
   }
})


//DELETE

router.delete("/:id",verifytokenandauthorization,async(req,res)=>{
    try{

        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("user has been deleted")
       
    } catch(err){

        res.status(500).json(err)
    }
})



//GET USER

router.get("/find/:id",verifytokenandadmin,async(req,res)=>{
    try{

        const user=await User.findById(req.params.id)

        const { password, ...others}=user._doc;

        res.status(200).json(others);
       
    } catch(err){

        res.status(500).json(err)
    }
})



//GET ALL USER

router.get("/",verifytokenandadmin,async(req,res)=>{
    try{
        const query=req.query.new


        const users=query? await User.find().sort({id:-1}).limit(5) : await User.find();
        res.status(200).json(users);
       
    } catch(err){

        res.status(500).json(err)
    }
})

module.exports = router;
    