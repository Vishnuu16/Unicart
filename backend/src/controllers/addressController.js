import Address from "../model/addressModel.js"
 
export const addAddress =async (req,res) => {
    try {
        const {address,userId} = req.body
        await Address.create({...address,userId})
        res.json({success:true, message:"Address added Successfully"})
    } catch (error) {
        console.log(error.message); 
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getAddress =async (req,res) => {
    try {
        console.log("getadd trg");
        const {userId} = req.query
      
        
        console.log('userid',userId);
        
        const addresses = await Address.find({userId})
        res.json({success:true, addresses})
    } catch (error) {
        console.log(error.message); 
        return res.status(500).json({ success: false, message: error.message });
    } 
}