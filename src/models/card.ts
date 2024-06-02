import mongoose from "mongoose";

interface ICard {
  name:string,
  link:string,
  owner:mongoose.Types.ObjectId,
  likes:mongoose.Types.ObjectId[] | undefined,
  createdAt: Date 
}

const cardSchema =new mongoose.Schema<ICard>({
  name:{
    type:String,
    required:true,
    minlength:2,
    maxlength:30
  },
  link:{
    type:String,
    required:true
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    // required: true  
  },
  likes:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default:[]
  }],
  createdAt:{
    type:Date,
    default:Date.now
  }
}, { versionKey: false})

export default mongoose.model<ICard>('card', cardSchema);
