import { useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { Dropdown } from "primereact/dropdown";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { Message, MessageProps } from "primereact/message";
import { useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import one from "./2.svg";
import two from "./3.svg";
import three from "./4.svg";
// import { loadAll } from "@/tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadFull } from "tsparticles"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const [init, setInit] = useState(false);

    // this should be run only once per application lifetime
    useEffect(() => {
        initParticlesEngine(async engine => {
            // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
            // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
            // starting from v2 you can add only the features you need reducing the bundle size
            //await loadAll(engine);
            //await loadFull(engine);
            await loadFull(engine);
            //await loadBasic(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = container => {
        console.log(container);
    };

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;

    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    const countryOptionTemplate = (option: { languageTag: string; label: string; href: string }) => {
        return (
            <div className="flex align-items-center p-4">
                <div>{getUnicodeFlagIcon(option.languageTag) + " " + option.label}</div>
            </div>
        );
    };

    const convertToSeverity = (type: string): MessageProps["severity"] => {
        switch (type) {
            case "success":
                return "success";
            case "error":
                return "error";
            case "warning":
                return "warn";
            case "info":
                return "info";
            default:
                return undefined;
        }
    };

    return (
        <>
            {init && (
                <Particles
                    id="tsparticles"
                    className="absolute z-[-100]"
                    particlesLoaded={particlesLoaded}
                    options={{
                        background: {
                            color: {
                                value: "#172b4d"
                            }
                        },
                        particles: {
                            number: {
                                value: 75,
                                density: {
                                    enable: true,
                                    area: 50
                                }
                            },
                            color: {
                                value: "#fb6340"
                            },
                            shape: {
                                type: "image",
                                size: 15,
                                options: {
                                    image: [{ src: one }, { src: two }, { src: three }]
                                }
                            },
                            opacity: {
                                value: 0.5,
                                random: false,
                                animation: {
                                    enable: false,
                                    speed: 1,

                                    sync: false
                                }
                            },
                            size: {
                                value: {
                                    min: 10,
                                    max: 60
                                },
                                animation: {
                                    enable: false,
                                    speed: 2,
                                    sync: false
                                }
                            },
                            links: {
                                enable: true,
                                distance: 250,
                                color: "#fb6340",
                                opacity: 0.4,
                                width: 2
                            },
                            move: {
                                enable: true,
                                speed: 1.5,
                                direction: "none",
                                random: true,
                                straight: false,
                                outModes: {
                                    default: "out"
                                },
                                attract: {
                                    enable: false,
                                    rotate: {
                                        x: 600,
                                        y: 1200
                                    }
                                }
                            }
                        },
                        interactivity: {
                            events: {
                                onHover: {
                                    enable: true,
                                    mode: "bubble"
                                },
                                onClick: {
                                    enable: false,
                                    mode: "bubble"
                                },
                                resize: true
                            },
                            modes: {
                                grab: {
                                    distance: 400,
                                    links: {
                                        opacity: 1
                                    }
                                },
                                bubble: {
                                    distance: 400,
                                    size: 90,
                                    duration: 2,
                                    opacity: 0.9,
                                    speed: 1
                                },
                                repulse: {
                                    distance: 150,
                                    duration: 0.4
                                },
                                push: {
                                    quantity: 4
                                },
                                remove: {
                                    quantity: 2
                                }
                            }
                        },
                        detectRetina: true
                    }}
                />
            )}
            <div className={kcClsx("kcLoginClass")}>
                <div id="kc-header" className={kcClsx("kcHeaderClass")}>
                    <div id="kc-header-wrapper" className={"font-extrabold !capitalize"}>
                        {msg("loginTitleHtml", realm.displayNameHtml)}
                    </div>
                </div>
                <div className={kcClsx("kcFormCardClass") + " border-t-0 rounded-lg"}>
                    <header className={kcClsx("kcFormHeaderClass")}>
                        {enabledLanguages.length > 1 && (
                            <div className={kcClsx("kcLocaleMainClass") + " mb-4"} id="kc-locale">
                                <div id="kc-locale-wrapper" className={kcClsx("kcLocaleWrapperClass")}>
                                    <Dropdown
                                        itemTemplate={countryOptionTemplate}
                                        value={""}
                                        onChange={e => window.location.replace(e.value.href)}
                                        options={enabledLanguages}
                                        optionLabel="label"
                                        placeholder={currentLanguage.label}
                                        className=""
                                        role="menu"
                                        tabIndex={-1}
                                        aria-labelledby="kc-current-locale-link"
                                        aria-activedescendant=""
                                        id="language-switch1"
                                    />
                                </div>
                            </div>
                        )}
                        {(() => {
                            const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                                <h1 id="kc-page-title">{headerNode}</h1>
                            ) : (
                                <div id="kc-username" className={kcClsx("kcFormGroupClass")}>
                                    <label id="kc-attempted-username">{auth.attemptedUsername}</label>
                                    <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                                        <div className="kc-login-tooltip">
                                            <i className={kcClsx("kcResetFlowIcon")}></i>
                                            <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                                        </div>
                                    </a>
                                </div>
                            );

                            if (displayRequiredFields) {
                                return (
                                    <div className={kcClsx("kcContentWrapperClass")}>
                                        <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                                            <span className="subtitle">
                                                <span className="required">*</span>
                                                {msg("requiredFields")}
                                            </span>
                                        </div>
                                        <div className="col-md-10">{node}</div>
                                    </div>
                                );
                            }

                            return node;
                        })()}
                    </header>
                    <div id="kc-content">
                        <div id="kc-content-wrapper">
                            {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                            {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                                <Message text={kcSanitize(message.summary)} className="text-sm mb-4" severity={convertToSeverity(message.type)} />
                            )}
                            {children}
                            {auth !== undefined && auth.showTryAnotherWayLink && (
                                <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                                    <div className={kcClsx("kcFormGroupClass")}>
                                        <input type="hidden" name="tryAnotherWay" value="on" />
                                        <a
                                            href="#"
                                            id="try-another-way"
                                            onClick={() => {
                                                document.forms["kc-select-try-another-way-form" as never].submit();
                                                return false;
                                            }}
                                        >
                                            {msg("doTryAnotherWay")}
                                        </a>
                                    </div>
                                </form>
                            )}
                            {socialProvidersNode}
                            {displayInfo && (
                                <div id="kc-info" className={kcClsx("kcSignUpClass")}>
                                    <div id="kc-info-wrapper" className={kcClsx("kcInfoAreaWrapperClass") + " rounded-lg"}>
                                        {infoNode}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
