const User = require('../Models/Users');

exports.createUser = async (req,res) => {

    try {
        
        const {name,role} = req?.body;
        if(!name || !role)
        {
            return res.status(404).json({
                flag: 0,
                flag_message: 'Provide Name' 
            })
        }

        let createResponse;
        if(role === "Student")
        {
            const chkStudent = await User.findOne({Role: "Student",IsActive : true,Name : name});

            if(chkStudent)
            {
                 return res.status(409).json({
                    flag: 0,
                    flag_message: 'Student with same name already exists !'
                 })
            }

            createResponse = await User.create({
                                Name: name,
                                Role: role,
                                IsActive : true
                            });

        }else if(role === "Teacher"){
           
            const chkTeacher = await User.findOne({Role: "Teacher",IsActive : 1});
            if(chkTeacher)
            {
                 return res.status(409).json({
                    flag: 0,
                    flag_message: 'One Teacher is already active'
                 })
            }
            
            createResponse = await User.create({
                Name: name,
                Role: role,
                IsActive : 1
                });
        }

        if(createResponse)
        {
            return res.status(201).json({
                flag: 1,
                flag_message: `Congratulations, new ${role} with ${name} is Entered in room !`,
                userId: createResponse?._id
            })
        }


    }catch(error)
    {
        return res.status(500).json({
            flag : 0,
            flag_message: error?.message || 'something went wrong'
        })
        
    }
}

// exports.getOnlineUsers = async (req,res) => {
//     try {
//              // use sockets to get online users or active users
//              const list = User.find({isActive: 1}).sort({createdAt: -1})

//              return res.status(200).json({
//                 flag : 1,
//                 flag_message: list,
//              })

//     }catch(error)
//     {
//         return res.status(500).json({
//             flag : 0,
//             flag_message: error?.message || 'something went wrong'
//         }) 
//     }
// }

exports.kickOutUser = async (student) => {
    try {
             // Inactive ki query
             // socket room se remove kargye
             if (!student) {
                throw new Error('student id is required');
            }
    
             const UserResponse = await User.findByIdAndUpdate(student,{
                IsActive : false,
                updatedAt: Date.now(),
             })

            if(UserResponse)
            {
                   return {success : true, message: 'Student removed'};
            } 

    }catch(error)
    {
        throw new Error(error.message || "Something went wrong");
    }
}