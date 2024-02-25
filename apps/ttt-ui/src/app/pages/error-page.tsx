import React from "react";
import { useNavigate } from "react-router-dom";

export function ErrorPage() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>YOU SHOULD NOT BE HERE!!!!!!!!!!!1</h1>
            <button onClick={() => navigate('/')}>Go back</button>
        </div>
    )
}