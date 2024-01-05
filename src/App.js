import React, { useState } from 'react';
import './app.css';    
import floorDataSet from './dataset.json';

const coreColors = {}
const dataset = floorDataSet
const getRandomPosition = (isCoreI4orI5) => {
  //To determine the index positions considering constraints for core i4 and core i5
    return {
      i: Math.floor(Math.random() * (isCoreI4orI5 ? 2 : 4)),
      j: Math.floor(Math.random() * 20)
    };
  };
const isPositionValid = (i, j, k, newGrid) => {
  //Ensure valid positioning such that no identical products were adjacent
    if (newGrid[i][j] !== null) return false;
    if (j > 0 && newGrid[i][j - 1] === k) return false;
    if (j < 19 && newGrid[i][j + 1] === k) return false;
    return true;
  };
const getGridData =  (startRuNumber,gridArray) => {
  //Sets up the initial state for grid data, enabling each grid to have its own unique data
    return new Array(20).fill(null).map((_, rIndex) => ({
    diode: false,
    unmasked: false,
    ruNumber: rIndex + startRuNumber,
    core: gridArray[rIndex]
  }));};
const getRandomColor = () => {
  //Dynamic color allocation to the Seat UUID column
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
dataset.forEach(item => {
    coreColors[item.product] = getRandomColor();
  });
console.log(coreColors)

const GridTableComponent = () => {
    
    const [grid, setGrid] = useState(Array(4).fill().map(() => Array(20).fill(null)));
  
    const distributeProducts = () => {
      //Allocate products within the array structure, representing the grids.
      let newGrid = [...grid].map(row => [...row]);
      for (const data of dataset) {
        let k = data.product;
        let v = data.repeat;
        while (v > 0) {
          let { i, j } = getRandomPosition(k === "Core i4" || k === "Core i5");
          if (isPositionValid(i, j, k, newGrid)) {
            newGrid[i][j] = k;
            v--;
          }
        }
      }
      console.log(newGrid);
      return newGrid
      
    };
  const floorValue = distributeProducts()
  const [allGridData, setAllGridData] = useState([
    getGridData(0,floorValue[0]),
    getGridData(40,floorValue[1]),
    getGridData(20,floorValue[2]),
    getGridData(60,floorValue[3])
  ]);

const toggleDiode = (gridIndex, cellIndex) => {
    //Turn blue onclick
    setAllGridData(prevData => prevData.map((grid, index) =>
        index === gridIndex 
        ? grid.map((item, idx) => idx === cellIndex ? { ...item, diode: !item.diode } : item)
        : grid
    ));
};

const toggleUnmasked = (core) => {
  //Highlights matching product cells in yellow
    setAllGridData(prevData => prevData.map(grid => 
        grid.map(item => item.core === core ? { ...item, unmasked: !item.unmasked } : item)
    ));
};

  return (
    
   <div className="grid-container">
    <table className="table">
        <thead>
            <tr><th colSpan="11" style={{padding:"8px"}}>TAPE-IN DB VIEW</th></tr>
            <tr>
                
                <th className='vertical-text' >Diode</th>
                <th className='vertical-text' >Unmasked</th>
                <th className='vertical-text'>RU#</th>
                <th colSpan= "3" className='core-column'>Seat UUID</th>
                <th className='vertical-text'>RU#</th>
                <th className='vertical-text'>Unmasked</th>
                <th className='vertical-text'>Diode</th>
                
            </tr>
        </thead>
        <tbody>
                    
                    {Array.from({ length: 20 }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            
                            {allGridData[0] && allGridData[0][rowIndex] && (
                                <>
                                    
                                    <td className={allGridData[0][rowIndex].diode ? 'diode-cell' : ''} onClick={() => toggleDiode(0, rowIndex)}></td>
                                    <td className={allGridData[0][rowIndex].unmasked ? 'unmasked-cell' : ''} onClick={() => toggleUnmasked(allGridData[0][rowIndex].core)}></td>
                                    <td className='ru-number-column'>{allGridData[0][rowIndex].ruNumber}</td>
                                    <td className='core-column' style={{backgroundColor:coreColors[allGridData[0][rowIndex].core]}}>{allGridData[0][rowIndex].core}</td>
                                    <td className='empty-cell'> </td>
                                </>
                                
                            )  
                            }
                            {allGridData[1] && allGridData[1][rowIndex] && (
                                <>
                                    <td className='core-column' style={{backgroundColor:coreColors[allGridData[1][rowIndex].core]}}>{allGridData[1][rowIndex].core}</td>
                                    <td className='ru-number-column'>{allGridData[1][rowIndex].ruNumber}</td>
                                    <td className={allGridData[1][rowIndex].unmasked ? 'unmasked-cell' : ''} onClick={() => toggleUnmasked(allGridData[1][rowIndex].core)}></td>
                                    <td className={allGridData[1][rowIndex].diode ? 'diode-cell' : ''} onClick={() => toggleDiode(1, rowIndex)}></td>    
                                </>
                            )}
                            
                        </tr>
                        
                    ))}
                    
                    <tr><td colSpan="11"><b>MIDHALF</b></td></tr>
                    {Array.from({ length: 20 }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            
                            {allGridData[2] && allGridData[2][rowIndex] && (
                                <>
                                    
                                    <td className={allGridData[2][rowIndex].diode ? 'diode-cell' : ''} onClick={() => toggleDiode(2, rowIndex)}></td>
                                    <td className={allGridData[2][rowIndex].unmasked ? 'unmasked-cell' : ''} onClick={() => toggleUnmasked(allGridData[2][rowIndex].core)}></td>
                                    <td className='ru-number-column'>{allGridData[2][rowIndex].ruNumber}</td>
                                    <td className='core-column' style={{backgroundColor:coreColors[allGridData[2][rowIndex].core]}}>{allGridData[2][rowIndex].core}</td>
                                    <td className='empty-cell'></td>
                                </>
                            )}

                            {/* Cells for the second grid */}
                            {allGridData[3] && allGridData[3][rowIndex] && (
                                <>
                                    <td className='core-column' style={{backgroundColor:coreColors[allGridData[3][rowIndex].core]}}>{allGridData[3][rowIndex].core}</td>
                                    <td className='ru-number-column'>{allGridData[3][rowIndex].ruNumber}</td>
                                    <td className={allGridData[3][rowIndex].unmasked ? 'unmasked-cell' : ''} onClick={() => toggleUnmasked(allGridData[3][rowIndex].core)}></td>
                                    <td className={allGridData[3][rowIndex].diode ? 'diode-cell' : ''} onClick={() => toggleDiode(3, rowIndex)}></td>
                                    
                                </>
                            )}
                        </tr>
                        
                        
                    ))}
                    <tr>
                        <td colSpan={3} style={{border:0}}></td><td colSpan={3}><b>MISC Block</b></td><td colSpan={3} style={{border:0}}></td>
                    </tr>
                </tbody>
    </table>
</div>
    
  );
};

export default GridTableComponent;