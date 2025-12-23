import { useState } from 'react';
import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';
import '../App.css';

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { Chip } from "primereact/chip";
import { Badge } from "primereact/badge";

export function App() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState('');

    function increment() {
        setCount(count + 1);
    }

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>ParkFlex Theme Showcase</h1>
            
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <Card title="Theme Component Test" style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        
                        <div>
                            <h3>Buttons</h3>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <Button label="Primary" onClick={increment} />
                                <Button label="Secondary" severity="secondary" />
                                <Button label="Success" severity="success" />
                                <Button label="Info" severity="info" />
                                <Button label="Warning" severity="warning" />
                                <Button label="Danger" severity="danger" />
                            </div>
                            <p>Count: {count}</p>
                        </div>

                        <div>
                            <h3>Input Fields</h3>
                            <InputText 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                placeholder="Enter your name"
                                style={{ width: '100%' }}
                            />
                            {name && <p>Hello, {name}!</p>}
                        </div>

                        <div>
                            <h3>Messages</h3>
                            <Message severity="success" text="Success: Theme loaded from @parkflex/themes" />
                            <Message severity="info" text="Info: Compiled locally from GitHub repo" style={{ marginTop: '10px' }} />
                            <Message severity="warn" text="Warning: Check theme colors" style={{ marginTop: '10px' }} />
                            <Message severity="error" text="Error: This is an error message" style={{ marginTop: '10px' }} />
                        </div>

                        <div>
                            <h3>Chips & Badges</h3>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <Chip label="ParkFlex" />
                                <Chip label="PrimeReact" icon="pi pi-check" />
                                <Chip label="GitHub" icon="pi pi-github" removable />
                                <i className="pi pi-bell" style={{ fontSize: '2rem', position: 'relative' }}>
                                    <Badge value="2" severity="danger" />
                                </i>
                            </div>
                        </div>

                    </div>
                </Card>
            </div>
            
            <p className="read-the-docs">
                Theme: github:ParkFlex/themes • Compiled locally via npm prepare
            </p>
        </>
    );
}
