// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import 'hardhat/console.sol';

contract WavePortal {
  uint256 totalWaves;
  uint256 private seed;

  event NewWave(address indexed from, uint256 timestamp, string message);

  struct Wave {
    address waver; //endereco origem do wave
    string message; 
    uint256 timestamp;
  }

  Wave[] waves; //array de structs Wave

  //mapping to store addresses with the timestamp of the last wave they've sent
  mapping(address => uint256) public lastWavedAt;


  constructor() payable {
    console.log('hey ho, lets go');

    seed = (block.timestamp + block.difficulty) % 100;
  }

  function wave(string memory _message) public {
    // we check to see if the last wave was at least 15 minutos ago 
    require(lastWavedAt[msg.sender] + 15 minutes < block.timestamp, "Wait for 15 minutes to wave again!");

    lastWavedAt[msg.sender] = block.timestamp;

    totalWaves += 1;
    console.log("%s has waved for you!", msg.sender);

    waves.push(Wave(msg.sender, _message, block.timestamp));

    //generates the random chance
    seed = (block.difficulty + block.timestamp + seed) % 100;
    console.log("# random generated: %d", seed);

    //gives 50% chance to win
    if (seed <= 50) {
      console.log("%s won!", msg.sender);

      //send prize
      uint256 prizeAmount = 0.005 ether;
      require(prizeAmount <= address(this).balance, "Trying to withdraw more money than the contract has");

      (bool success, ) = (msg.sender).call{ value: prizeAmount }("");
      require(success, "Withdraw failed!");
    }

    emit NewWave(msg.sender, block.timestamp, _message);
  }

  function getAllWaves() public view returns (Wave[] memory) {
    return waves;
  }

  function getTotalWaves() public view returns (uint256) {
    console.log("We have a total of %d waves!", totalWaves);
    return totalWaves;
  }
}