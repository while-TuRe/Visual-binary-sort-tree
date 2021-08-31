import globalData from '../global'
function Node(name){
    this.name = name
    this.children = [{},{}]
}
function searchNode(num){
    var p = globalData.data
    var path = []
    while(p!=null && p.children!=undefined){
        parent=p
        path.push(p)
        if(p.name>num){//向左延伸
            p = p.children[0]
        }else if(p.name<num){//向右延伸
            p=p.children[1]
        }else{//存在
            break
        }
    }
    //最后一步得到的最新p（存在值/null)
    if(p==null || p.children==undefined){
        path.push(null)
    }
    //console.log("path:",path)
    return path
}
function addDataArray(path,num){
    //console.log("addDataArray",path,num)
    if(path[path.length-1]==null){//未出现过
        var p = new Node(num)
        if(path.length<2) {//首个元素，根节点
            globalData.data=p
            //console.log("root ",globalData.data,p)
        }
        else{
            var parent =path[path.length-2] //建立连接
            //console.log("parent",parent)
            if(parent.name>p.name){
                parent.children[0]=p
            }else{
                parent.children[1]=p
            }
        }
    }
}
function flagNull(node){
    return node.name !=undefined
}
export default{
    /**返回值：搜索路径上的node。如果搜索数字找到，则最后一个就是，否则最后一个为null */
   
    creat(data){
        globalData.data=null
        for(var i=0;i<data.length;i++){
            var path = searchNode(data[i])
            addDataArray(path,data[i])
            //console.log(data[i],path,globalData.data)
        }
    },
    search(num){
        return searchNode(num)
    },
    add(path,num){
       // console.log("add",path,num)
       addDataArray(path,num) 
    },
    //确保要删除的节点已存在
    deleteNode(path){
        var node = path[path.length-1]
        var parent = path.length<2?null:path[path.length-2]
        var index = parent!=null && node.name < parent.name ?0:1
        //console.log(globalData.data,node,"node",parent,"parent")
        if(flagNull(node.children[0])){//如果左子树存在
            //如果右子树也存在，则用左子树最大值替换node
            if(flagNull(node.children[1])){
                //找到左子树最大值 一直找右孩子
                var p = node.children[0]
                //console.log(p)
                while(flagNull(p.children[1])){//p.children[1]不是{}
                    path.push(p)
                    p=p.children[1]
                }
                path.push(p)
                //递归删除
                this.deleteNode(path)

                //用要删除的p替换掉node
                if(parent==null){
                    globalData.data =p
                }else{
                    parent.children[index]=p
                }
                p.children[0]=node.children[0]
                p.children[1]=node.children[1]
                //console.log("deletefirst down")
            }else{//仅左无右
                if(parent==null){
                    globalData.data =node.children[0]
                }else{
                    parent.children[index]=node.children[0]
                }
            } 
        }else{//无左
            //仅右
            if(flagNull(node.children[1])){
                if(parent==null){
                    globalData.data =node.children[1]
                }else{
                    parent.children[index]=node.children[1]
                }
            }else{
                if(parent==null){
                    globalData.data ={}
                }else{
                    parent.children[index]={}
                }
            }
        }
    }
}