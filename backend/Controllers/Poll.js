const Poll = require('../Models/Poll');
const Option = require('../Models/Options');

exports.createPoll = async (pollData,onlineuserslength) => {
    try {
      const { question, options, teacher, time } = pollData;
  
      if (!question || !options || options.length === 0) {
         throw new Error("Provide question and at least 1 option");
      }
  
      
      const latestPoll = await Poll.findOne({ CreatedBy: teacher, IsActive: 1})
        .sort({ createdAt: -1 });
  
      if (latestPoll) {
  
        //online users se km karegye
        if (latestPoll.AnsweredBy.length && onlineuserslength && latestPoll.AnsweredBy.length === onlineuserslength) {
           await Poll.findByIdAndUpdate(latestPoll._id, { IsActive: false });
        } else {
           throw new Error( "Wait for all students to answer the previous poll")
        }
      }
  
      
      const PollResponse = await Poll.create({
        Question: question,
        Options: [],
        CreatedBy: teacher,
        AnsweredBy: [],
        IsActive: true,
        Time: time,
      });
  
      
      const optionIds = [];
      for (const op of options) {
        const OptionResponse = await Option.create({
          Text: op.text,
          IsCorrect: op.isCorrect,
          Submits: 0,
        });
  
        optionIds.push(OptionResponse._id);
      }

      PollResponse.Options = optionIds;

      await PollResponse.save();

      const pollhis = await Poll.findOne({_id: PollResponse._id})
                                          .populate("Options")
                                           .exec();
      return pollhis;
  
    } catch (error) {
        throw new Error(error.message || "Something went wrong");
    }
};
  
exports.submitPoll = async (pollData) => {
    try {
        const {pollId,student,option} = pollData;

        const PollResponse  =  await Poll.findByIdAndUpdate({_id : pollId},{
            $push: {
                AnsweredBy: student
            }
        },{new:true});

        const OptionResponse = await Option.findByIdAndUpdate({_id: option},{
            $inc : {
                Submits : 1
            }
        },{new : true});

        
        if(PollResponse && OptionResponse)
        {
               return PollResponse;
        }else {
            throw new Error("Poll or Option not found");
        } 

    }catch(error)
    {
        throw new Error(error.message || "Something went wrong");
    }
}

exports.PollHistory = async (pollId) => {
    try {  
            const LatestPoll = await Poll.findOne({_id: pollId})
                                          .populate("Options")
                                           .exec();
            if(LatestPoll)
            {
                return LatestPoll;
            }
    }catch(error)
    {
        throw new Error(error.message || "Something went wrong");
    }
}