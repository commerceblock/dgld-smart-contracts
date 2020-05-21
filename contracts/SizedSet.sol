pragma solidity ^0.5.16;

contract SizedSet {
  uint private _size;
  uint private _cursor = 0;
  mapping (bytes32 => uint) private _valToIndex;
  mapping (uint => bytes32) private _indexToVal;

  constructor(uint size) public {
    _size = size;
  }

  function add(bytes32 val) public returns (bool) {
    uint cursor = _cursor+1;
    require(val != 0, "sizedSet will not accept 0 value");
    if(contains(val)){
      return false;
    }
    if(_indexToVal[cursor] != 0 ){
       _valToIndex[_indexToVal[cursor]] = 0;    			        			    
    }
    _valToIndex[val] = cursor;
    _indexToVal[cursor] = val;
    _cursor = (_cursor+1) % _size;
    return true;
  }

  function contains(bytes32 val) public view returns (bool) {
    return _valToIndex[val] != 0;
  }
  
}