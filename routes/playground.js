const river = require('../models/river-model');
exports.insertVote = function(req,callback){
	console.log(req.query)
	var items = [voteModel];
	async.each(items,function(item,callback1){
		item.findOne({"uid":req.user._id,"qid":req.query.qid},function(err,data){
			if(err)
				throw err
			else{

				if(data == null){
					callback1({"todo":"insert"})
				}
				else if(req.query.vote == data.vote){
					callback({"res":false,"data":"Your response is same you cant insert it again"})
				}
				else{
					callback1({"todo":"update"});
				}
			}
		})
	},function(found){
		if(found.todo == "insert"){
			new voteModel({
				"uid"		: req.user._id,
				"qid"		: req.query.qid,
				"vote"		: req.query.vote
			}).save((err)=>{
				if(err)
					throw err
				else{
					callback({"res":true,"data":"Successfully inserted"})
				}
			})
		}
		else if(found.todo == "update"){
			voteModel.findOneAndUpdate({"uid":req.user._id,"qid":req.query.qid},{"vote":req.query.vote},function(err){
				if(err)
					throw err
				else{

				}callback({"res":true,"data":"Successfully inserted"})
			})
		}

	})

}
