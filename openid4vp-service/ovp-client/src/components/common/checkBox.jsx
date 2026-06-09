import { Fragment } from "react";

            export default function CheckBox({ onClick, label, id, checked }) {
                const handleChange = (e) => {
                    onClick(e.target.checked);
                };

                return (
                    <Fragment>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            margin: "8px 0"
                        }}>
                            <input
                                type="checkbox"
                                id={`checkbox-${id}`}
                                value={id}
                                onChange={handleChange}
                                checked={checked}
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    accentColor: "#4F8EF7",
                                    borderRadius: "6px",
                                    border: "2px solid #4F8EF7",
                                    cursor: "pointer",
                                    margin: 0
                                }}
                            />
                            <label
                                htmlFor={`checkbox-${id}`}
                                style={{
                                    fontSize: "16px",
                                    color: "#222",
                                    cursor: "pointer",
                                    userSelect: "none"
                                }}
                            >
                                {label}
                            </label>
                        </div>
                    </Fragment>
                );
            }