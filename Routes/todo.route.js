const express = require("express");

const TodoModel = require("../Model/Todo.model")


const todoRouter = express.Router();


todoRouter.get("/", async (req,res)=>{

try{
    let {UserId} = req.body;
    let data = await TodoModel.find({UserId});
    res.send({todos:data})
}
catch(err){
        res.send({ msg: "Something went wrong somewhere" });
}


});

todoRouter.post("/create", async (req, res) => {

    let data = req.body;

    try{
         if(data.taskname && data.status && data.tag){
        let newData = new TodoModel(data);
        await newData.save();
        res.send({msg:"Todo added successfully"});

    }
    else{
           res.send({ msg: "Plz pass all valid and required data"});
    }

    }

    catch(err){
          res.send({ msg: "Something went wrong somewhere" });
          console.log(err)
    }



});

todoRouter.patch("/update/:todoId", async(req, res) => {

    try{
        if(req.params.todoId){
            let data = req.body
            let { todoId } = req.params;
            let { UserId } = req.body;

            let oneTodo = await TodoModel.findOne({$and:[{_id:todoId,UserId}]})
            console.log(oneTodo);
            if(oneTodo){
                
            await TodoModel.findByIdAndUpdate({_id:todoId},data)    
            res.send({ msg: "Todo updated successfully" });

            }
        }
        else{
             res.send({ msg: "Plz pass todo Id" });
        }
        
    }
    catch(err){
            res.send({ msg: "You are not authorize to update this todo" });
            console.log(err)
    }

});

todoRouter.delete("/delete/:todoId", async (req, res) => {

    try {
      if (req.params.todoId) {
        let data = req.body;
        let { todoId } = req.params;
        let { UserId } = req.body;

        let oneTodo = await TodoModel.findOne({
          $and: [{ _id: todoId, UserId }],
        });
        if (oneTodo) {
          await TodoModel.findByIdAndDelete({ _id: todoId }, data);
          res.send({ msg: "Todo deleted successfully" });
        }
      } else {
        res.send({ msg: "Plz pass todo Id" });
      }
    } catch (err) {
      res.send({ msg: "You are not authorize to update this todo" });
      console.log(err);
    }

});





module.exports = todoRouter;