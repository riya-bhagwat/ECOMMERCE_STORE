// const router=require("express").Router();
// const stripe=require("stripe")(process.env.STRIPE_KEY);


// router.post("/payment",(req,res)=>{
//     stripe.paymentIntents.create({
//         //source:req.body.tokenId,
//         amount:req.body.amount,
//         currency:"inr"
//     },(stripeErr,stripeRes)=>{
//         if(stripeErr){
//             res.status(500).json(stripeErr)
            
//         }else{
//             res.status(200).json(stripeRes)
//         }
//     })
// })
const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const convertTokenToSource = async (tokenId) => {
  try {
    const source = await stripe.sources.create({
      type: 'card',
      token: tokenId,
    });

    // `source.id` contains the converted source ID
    return source.id;
  } catch (error) {
    // Handle the error appropriately
    console.error(error);
    throw error;
  }
};

router.post("/payment", async (req, res) => {
  try {
    const sourceId = await convertTokenToSource(req.body.tokenId);

    const paymentIntent = await stripe.paymentIntents.create({
      source: sourceId,
      amount: req.body.amount,
      currency: "inr"
    });

    res.status(200).json(paymentIntent);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

// module.exports=router;