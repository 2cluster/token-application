import React from "react";

export function Contract({ tokenData }) {
    return (
        <div
            style={{
                background: "rgba(255, 255, 2, 1)",
                width: "100%",
            }}
        >
            <div className="container">
                <h1>Contract Info</h1>
                <div className="row">
                    <div className="col-2">
                        <p>token:</p>
                        <p>symbol:</p>
                        <p>address:</p>
                        <p>totalSupply:</p>
                    </div>
                    <div className="col-10">
                        <p><b>{tokenData.name}</b></p>
                        <p><b>{tokenData.symbol}</b></p>
                        <p><b>{tokenData.address}</b></p>
                        <p><b>$ {(Math.round(tokenData.total * tokenData.decimals ** 10) / (tokenData.decimals ** 10)).toFixed(tokenData.decimals).toString()}</b></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
