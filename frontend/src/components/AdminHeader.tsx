import {Sidebar} from "primereact/sidebar";
import {Button} from "primereact/button";
import {useState} from "react";
import { useNavigate } from "react-router";

export function AdminHeader () {
    const [visible, setVisible] =  useState(false);
    const navigate = useNavigate();
    return (
            <div className="card flex justify-content-center">
                <Sidebar visible={visible} onHide={() => setVisible(false)}>

                    <Button onClick={() => navigate("/demo")}>List</Button>
                    <Button>Parameters</Button>
                    <Button>Spots</Button>
                </Sidebar>
                <Button icon="pi pi-arrow-right" onClick={() => setVisible(true)} />
            </div>
    )
}