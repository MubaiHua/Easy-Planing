const Log = require('../models/logModel');

exports.addLog = async(req, res) =>{
    const {username, content, session} = req.body;
    try{
        await Log.create({
            username:username,
            content:content,
            session: session
        })
        res.status(201).json({
            status: 'success'
        })
    }
    catch(err){
        res.status(401).json(err.message);
    }
}

exports.getAllLog = async(req,res) =>{
    try{
        const all = await Log.find({});
        res.status(201).json({
            allLogs: all
        })
    }
    catch(err){
        res.status(401).json(err.message);
    }
}

exports.deleteLog = async(req,res) =>{
    const {_id} = req.body;
    try{
        await Log.findByIdAndDelete(_id);
        res.status(201).json({
            status: 'success'
        })
    }
    catch(err){
        res.status(401).json(err.message);
    }
}

exports.updateLog = async(req, res) => {
    const {_id, newContent, newSession}  = req.body;
    try{
        await Log.findByIdAndUpdate(_id, {content:newContent,session:newSession});
        res.status(201).json({
            status: 'success'
        })
    }
    catch(err){
        res.status(401).json(err.message);
    }
}

exports.searchLog = async(req, res) =>{
    const {username, content, session} = req.body;
    let logs;
    let newContent = content;
    if(content === "")
        newContent = "."
    try{
        if(username === "" && session === "xxxxxxxx"){
            logs = await Log.find({content:{$regex: newContent, $options: 'is'}})
            res.status(201).json({
                logs: logs
            })
        }
        else if(username === ""){
            logs = await Log.find({content:{$regex: newContent, $options: 'is'}, session: session})
            res.status(201).json({
                logs: logs
            })
        }
        else if(session === "xxxxxxxx"){
            logs = await Log.find({content:{$regex: newContent, $options: 'is'}, username: username})
            res.status(201).json({
                logs: logs
            })
        }
        else{
            logs = await Log.find({content:{$regex: newContent, $options: 'is'}, username: username, session:session})
            res.status(201).json({
                logs: logs
            })
        }
    }
    catch(err){
        res.status(401).json(err.message);
    }
}