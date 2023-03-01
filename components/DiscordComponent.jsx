import styles from "../styles/DiscordComponent.module.css";
import React, { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSignMessage, useAccount } from "wagmi";
import { verifyMessage } from "ethers/lib/utils";
import { toast } from "react-toastify";

export default function DiscordComponent() {
    const { data: session } = useSession();
    const { address, isConnected } = useAccount();
    const [ subtitle, setSubtitle ] = useState("");
    const [ integrationText, setIntegrationText ] = useState("Integrate with Discord");
    const [ synchronized, setSynchronized ] = useState(false);
    
    const { isLoading, signMessage } = useSignMessage({
        onSuccess(data, variables) {
            const recoveredAddress = verifyMessage(variables.message, data);
            if (recoveredAddress === address) {
                fetch("http://localhost:3000/api/integration", {
                    method: "POST",
                    body: JSON.stringify({
                        discord: session.user.id,
                        address: address,
                        signature: data,
                    }),
                    headers: {
                        "content-type": "application/json"
                    }
                }).then(console.log).catch((e) => console.error(e));

                let toastText = 'Signature validated!';

                toastText = synchronized ? toastText + '\nAddress updated!' : toastText;

                toast.success(toastText, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        }
    });

    useEffect(() => {
        const newSubtitle = isConnected && session
            ? `Welcome, <b>${session.user.name}</b>! Click the button below:`
            : "You must connect your wallet and Discord to proceed";
        
        setSubtitle(newSubtitle);

        if (!synchronized && session) {
            fetch(`http://localhost:3000/api/integration/${session.user.id}`, { method: "GET" })
            .then((response) => response.json())
            .then((data) => {
                if (data.address) {
                    setSynchronized(true);
                    setIntegrationText("Update Address");

                    toast.info('Looks like you already synchronized your wallet address!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        toastId: "synchronized",
                    });
                }
            });
        }
    }, [isConnected, session]);

    return (
        <div className={styles.container}>
            <header className={styles.header_container}>
                <h1>
                    Discord <span>Integration</span>
                </h1>
                <p dangerouslySetInnerHTML={ { __html: subtitle } } />
            </header>
            {isConnected && session ? (
                <div className={styles.buttons_container}>
                    {!isLoading && (
                        <a
                            onClick={() => {
                                const message = session.user.id;
                                signMessage({ message });
                            }}
                        >
                            <div className={styles.button}>
                                <p>{integrationText}</p>
                            </div>
                        </a>
                    )}
                    <a
                        target={"_blank"}
                        onClick={() => signOut("discord")}
                    >
                        <div className={styles.button}>
                            <img
                                src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6ca814282eca7172c6_icon_clyde_white_RGB.svg"
                                width={"20px"}
                                height={"20px"}
                            />
                            <p>Disconnect</p>
                        </div>
                    </a> 
                </div>
            ) : (
                <div className={styles.buttons_container}>
                    <a
                        target={"_blank"}
                        onClick={() => signIn("discord")}
                    >
                        <div className={styles.button}>
                            <img
                                src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6ca814282eca7172c6_icon_clyde_white_RGB.svg"
                                width={"20px"}
                                height={"20px"}
                            />
                            <p>Connect</p>
                        </div>
                    </a>
                </div>
            )}
        </div>
    );
}