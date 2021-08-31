<template>
  <div id="app">
    <div class="init" v-if="init">
      <div>请输入欲建立的排序二叉树节点值</div>
      <input class="init-input" v-model.lazy="initelems"/>
      <button v-on:click="initTree">创建</button>
    </div>
    <div class="all" v-else>
      <div class="inputs">
        <div class="add">
          添加节点
          <input v-model.number="addelem" type="number"/>
          <div @click="add"></div>
        </div>
        <div class="delete">
          删除节点
          <input v-model.number="deletelem" type="number"/>
          <div @click="Delete"></div>
        </div>
        <div class="search">
          搜索节点
          <input v-model.number="searchelem" type="number"/>
          <div @click="search"></div>
        </div>
      </div>
      <Tree ref="tree"></Tree>
      <p>{{msg}}</p>
    </div>
  </div>
  
</template>

<script>
import BinaryTree from './logic/BinaryTree'
import globalData from './global.js' 
import Tree from './components/Tree.vue'

export default {
  name: 'App',
  data () {
    return {
      init: true,
      addelem: 0,
      searchelem:0,
      deletelem:11,
      initelems: "11 7 9 8 22",
      update:true,
      msg:''
    }
  },
  components: {Tree},
  methods: {    
    initTree: function () {
      /*处理读入字符串*/
      var input_data = this.initelems.trim().split(/,| |，/)
      var data = []
      /*将读取到的字符串转为数字*/ 
      for (var i=0; i<input_data.length; i++){
        data.push(parseInt(input_data[i]))
      }
      console.log(data)

      /*切换页面 */
      this.init = false
      this.update=!this.update

      /**创建 */
      BinaryTree.creat(data)
      console.log(globalData.data,"App.vue after creat before show ")
      this.$nextTick(()=>{
        this.$refs.tree.updateTree()

      })
      
    },
    search:function(){
      console.log('---------------search'+this.searchelem+'---------------------')
      var path = BinaryTree.search(this.searchelem)
      this.$refs.tree.showPath(path)
      if(path[path.length-1] == null){
        this.msg = "未找到 "+this.searchelem+" 节点"
      }else{
        this.msg = "成功找到 "+this.searchelem+" 节点"
      }
    },
    add:function(){
      console.log('---------------add'+this.addelem+'---------------------')
      var path = BinaryTree.search(this.addelem)
      //console.log("addpath:",path)
      
      
      if(path[path.length-1] == null){
        //显示添加路径
        this.$refs.tree.showPath(path.slice(0,path.length-1))
        //在数据结构中添加
        BinaryTree.add(path,this.addelem)
        //console.log(globalData.data)
        //显示添加后结果
        this.$refs.tree.updateTree(this.addelem,(path.length-1)*globalData.baseTime)
        this.msg = "成功添加 "+this.addelem+" 节点"
      }else{
        //显示添加路径
        this.$refs.tree.showPath(path)
        this.msg = this.addelem+" 节点已存在"
      }
    },
    Delete:function(){
      console.log('---------------delete'+this.deletelem+'---------------------')

      //this.$refs.tree.updateTree(this.deletelem)
      var path = BinaryTree.search(this.deletelem)
      if(path[path.length-1]==null){
        this.msg = "要删除的节点 "+this.deletelem+" 不存在"
      }else{
        BinaryTree.deleteNode(path)
        this.msg = "成功删除 "+this.deletelem+" 节点"
        this.$refs.tree.updateTree(null,globalData.baseTime)
      }
    }
  }
}
</script>

<style>
html,
body,
#app{
  height:100%;
  width:100%;
  position: relative;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size:1.4em;
}
.init{
  position: relative;
  top:100px;
  /* padding: 100px,0,0,0; */
}
.init-input{
  position: relative;
  box-sizing: border-box;
  text-align:center;
  font-size:1.4em;
  height:50px;
  width:60%;

  border-radius:4px;
  border:1px solid #c8cccf;
  color:#6a6f77;
  -web-kit-appearance:none;
  -moz-appearance: none;
  outline:0;
  text-decoration:none;

  vertical-align:middle;
}
.init button{
  height:50px;
  width:75px;
  border-radius:4px;
  border:1px solid #c8cccf;
}
.inputs{
  position: relative;
  width: 100%;
  height: 90%;
  padding:50px 0 0 0;
  margin: auto;
}
/**add serch */
.inputs div{
  position: relative;
  display: inline;
  height:50px;
  width:100%;
  padding:0 10px;
  margin:auto;
}
.inputs div input{
  position: relative;
  box-sizing: border-box;
  text-align:center;
  font-size:1.4em;
  height:50px;
  width:15%;

  border-radius:4px;
  border:1px solid #c8cccf;
  color:#6a6f77;
  -web-kit-appearance:none;
  -moz-appearance: none;
  outline:0;
  text-decoration:none;

  vertical-align:middle;
}
.inputs div div{
  padding: 25px 25px;
  vertical-align:middle;
  display: inline;
  background-image: url("./assets/enter.png" );
  background-repeat: no-repeat;
  background-position: center;
  -webkit-background-size: 100%;
  background-size: 100%;
}

</style>
