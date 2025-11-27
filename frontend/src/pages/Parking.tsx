import { useEffect, useState } from "react";
import type { SpotState } from "../api/spots";
import { getSpots } from "../api/spots";
import {ParkingGrid, Spot} from "../components/reservation/Grid";
import {Button} from "primereact/button";



// function DynamicButton() {
//     const [data, setData] = useState<SpotState[]>([]);
//     const defaultStartDate = new Date();
//     const defaultEndDate = new Date();
//     // const [bgColor, setBgColor] = useState('gray');
//
//     useEffect(() => {
//         const callApi = async () => {
//             try {
//                 const data = await getSpots(defaultStartDate, defaultEndDate);
//                 setData(data);
//             } catch {
//                 console.log("Failed to fetch data");
//             }
//         };
//         callApi();
//     }, []);
//
//     // useEffect(() => {
//     //    if (data[0].occupied) {
//     //         setBgColor('red');
//     //     } else {
//     //         setBgColor('gray');
//     //     }
//     // }, [data]);
//
//     return (
//         <Button style={{ backgroundColor: bgColor }}>
//             {data[0].id}
//         </Button>
//
//
// );
// }


export function ParkingPage() {
  const [data, setData] = useState<SpotState[]>([]);
  const defaultStartDate = new Date();
  const defaultEndDate = new Date();


  useEffect(() => {
    const callApi = async () => {
      try {
        const data = await getSpots(defaultStartDate, defaultEndDate);
        setData(data);
      } catch {
        console.log("Failed to fetch data");
      }
    };
    callApi();
  }, []);

  return (
    <div className="parking-page">
      <h1>Parking View</h1>
      <ParkingGrid spots={data} />
        <div className="parking-spots" style={{
            display: 'grid',
            width: '80%',
            // gridTemplateColumns: 'repeat(4, auto)', // 10 column
            gridTemplateColumns: 'auto auto auto auto',
            gridTemplateRows: 'repeat(10, 40px)',    // 4 row
            gap: '10px',
            // gridAutoFlow: 'column',

        }}>

            {data.length > 0 && data.map((spot, index) => (
                // <div key={index}>{spot.occupied ? 'Zajęte' : 'Wolne'}</div>
                <Spot key={index}
                        id={spot.id}
                      role={spot.role}
                      occupied={spot.occupied} />
            ))}

        </div>
    </div>
  );
}
