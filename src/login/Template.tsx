import { memo, useEffect, useState } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { Dropdown } from "primereact/dropdown";
import {
    GB,
    DE,
    FR,
    ES,
    IT,
    NL,
    PL,
    PT,
    BR,
    RU,
    TR,
    CZ,
    DK,
    GR,
    FI,
    HU,
    JP,
    KR,
    LT,
    LV,
    NO,
    RO,
    SK,
    SE,
    UA,
    CN,
    TW,
    SA,
    TH,
    IR,
    GE,
    US,
    type FlagComponent
} from "country-flag-icons/react/3x2";
import { Message, MessageProps } from "primereact/message";
import Particles, { IParticlesProps, initParticlesEngine } from "@tsparticles/react";
import one from "./2.svg";
import two from "./3.svg";
import three from "./4.svg";
import { loadFull } from "tsparticles";

import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "../theme.css";

const LANGUAGE_TO_COUNTRY: Record<string, string> = {
    en: "GB",
    de: "DE",
    fr: "FR",
    es: "ES",
    it: "IT",
    nl: "NL",
    pl: "PL",
    pt: "PT",
    ru: "RU",
    tr: "TR",
    cs: "CZ",
    da: "DK",
    el: "GR",
    fi: "FI",
    hu: "HU",
    ja: "JP",
    ko: "KR",
    lt: "LT",
    lv: "LV",
    no: "NO",
    nb: "NO",
    nn: "NO",
    ro: "RO",
    sk: "SK",
    sv: "SE",
    uk: "UA",
    zh: "CN",
    ar: "SA",
    ca: "ES",
    fa: "IR",
    th: "TH",
    ka: "GE"
};

function getCountryCode(languageTag: string): string {
    const normalized = languageTag.replace("_", "-");
    const parts = normalized.split("-");
    const lang = parts[0].toLowerCase();
    return parts.length > 1 && parts[1].length === 2 ? parts[1].toUpperCase() : LANGUAGE_TO_COUNTRY[lang] ?? lang.toUpperCase();
}

const FLAG_COMPONENTS: Record<string, FlagComponent> = {
    GB,
    DE,
    FR,
    ES,
    IT,
    NL,
    PL,
    PT,
    BR,
    RU,
    TR,
    CZ,
    DK,
    GR,
    FI,
    HU,
    JP,
    KR,
    LT,
    LV,
    NO,
    RO,
    SK,
    SE,
    UA,
    CN,
    TW,
    SA,
    TH,
    IR,
    GE,
    US
};

function FlagIcon({ languageTag }: { languageTag: string }) {
    const code = getCountryCode(languageTag);
    const Flag = FLAG_COMPONENTS[code];
    if (!Flag) {
        return <i className="pi pi-globe text-xs" aria-hidden="true" />;
    }
    return <Flag className="w-4 h-3 rounded-[2px] shadow-sm shrink-0 object-cover" aria-hidden="true" />;
}

const particlesConfig: IParticlesProps["options"] = {
    background: {
        color: {
            value: "#172b4d"
        }
    },
    particles: {
        number: {
            value: 75,
            density: {
                enable: true
            }
        },
        color: {
            value: "#fb6340"
        },
        shape: {
            type: "image",
            options: {
                image: [{ src: one }, { src: two }, { src: three }]
            }
        },
        opacity: {
            value: 0.5,
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
            }
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
};

const ParticlesContainer = memo(function ParticlesContainer() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async engine => {
            await loadFull(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);
    return <>{init && <Particles id="tsparticles" className="fixed inset-0 z-0" options={particlesConfig} />}</>;
});

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

    const countryOptionTemplate = (option: { languageTag: string; label: string; href?: string }) => {
        if (!option) return null;
        return (
            <div className="flex items-center gap-2 text-xs font-medium">
                <FlagIcon languageTag={option.languageTag} />
                <span>{option.label}</span>
            </div>
        );
    };

    const selectedLanguageOption = enabledLanguages.find(l => l.languageTag === currentLanguage.languageTag) ?? currentLanguage;

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
            <ParticlesContainer />
            <div className={clsx(kcClsx("kcLoginClass"), "relative z-10")}>
                <div id="kc-header" className={kcClsx("kcHeaderClass")}>
                    <div
                        id="kc-header-wrapper"
                        className={clsx(kcClsx("kcHeaderWrapperClass"), "font-extrabold !capitalize tracking-wide text-white drop-shadow-md")}
                    >
                        {msg("loginTitleHtml", realm.displayNameHtml.toUpperCase())}
                    </div>
                </div>
                <div
                    className={clsx(
                        kcClsx("kcFormCardClass"),
                        "relative !border-t-0 rounded-xl bg-[linear-gradient(87deg,#fb6340,#fbb140)] shadow-2xl px-8 py-8"
                    )}
                >
                    {enabledLanguages.length > 1 && (
                        <div className="flex justify-end -mt-2 mb-2" id="kc-locale">
                            <div id="kc-locale-wrapper">
                                <Dropdown
                                    itemTemplate={countryOptionTemplate}
                                    valueTemplate={() => countryOptionTemplate(currentLanguage)}
                                    value={selectedLanguageOption}
                                    onChange={e => {
                                        if (e.value?.href) {
                                            window.location.replace(e.value.href);
                                        }
                                    }}
                                    options={enabledLanguages}
                                    optionLabel="label"
                                    placeholder={currentLanguage.label}
                                    className="kc-locale-pill"
                                    panelClassName="kc-locale-panel"
                                    aria-label={msgStr("languages")}
                                    id="language-switch1"
                                />
                            </div>
                        </div>
                    )}
                    <header className={clsx(kcClsx("kcFormHeaderClass"), "mb-5")}>
                        {(() => {
                            const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                                <h1 id="kc-page-title" className="text-2xl font-bold text-[#172b4d] text-center m-0">
                                    {headerNode}
                                </h1>
                            ) : (
                                <div
                                    id="kc-username"
                                    className="flex items-center justify-between gap-3 rounded-lg bg-[#243b67] border border-white/20 px-4 py-2.5 text-gray-100"
                                >
                                    <label id="kc-attempted-username" className="font-medium text-sm truncate m-0">
                                        {auth.attemptedUsername}
                                    </label>
                                    <a
                                        id="reset-login"
                                        href={url.loginRestartFlowUrl}
                                        aria-label={msgStr("restartLoginTooltip")}
                                        title={msgStr("restartLoginTooltip")}
                                        className="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1.5 text-sm"
                                    >
                                        <i className="pi pi-refresh" aria-hidden="true"></i>
                                        <span className="sr-only">{msg("restartLoginTooltip")}</span>
                                    </a>
                                </div>
                            );

                            if (displayRequiredFields) {
                                return (
                                    <div className={kcClsx("kcContentWrapperClass")}>
                                        <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle text-[#172b4d] text-xs mb-1")}>
                                            <span className="subtitle">
                                                <span className="required text-red-900 font-bold mr-0.5">*</span>
                                                {msg("requiredFields")}
                                            </span>
                                        </div>
                                        <div>{node}</div>
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
                                <Message
                                    text={<span dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />}
                                    className="w-full justify-start text-left text-sm mb-5"
                                    severity={convertToSeverity(message.type)}
                                />
                            )}
                            {children}
                            {auth !== undefined && auth.showTryAnotherWayLink && (
                                <form id="kc-select-try-another-way-form" action={url.loginAction} method="post" className="mt-4 text-center">
                                    <div className={kcClsx("kcFormGroupClass")}>
                                        <input type="hidden" name="tryAnotherWay" value="on" />
                                        <a
                                            href="#"
                                            id="try-another-way"
                                            className="text-sm font-semibold text-[#172b4d] underline underline-offset-4 hover:text-[#111827]"
                                            onClick={e => {
                                                e.preventDefault();
                                                document.forms["kc-select-try-another-way-form" as never].submit();
                                            }}
                                        >
                                            {msg("doTryAnotherWay")}
                                        </a>
                                    </div>
                                </form>
                            )}
                            {socialProvidersNode}
                            {displayInfo && (
                                <div id="kc-info" className={clsx(kcClsx("kcSignUpClass"), "mt-5")}>
                                    <div
                                        id="kc-info-wrapper"
                                        className={clsx(
                                            kcClsx("kcInfoAreaWrapperClass"),
                                            "rounded-lg !bg-transparent !border-t border-[#172b4d]/20 !p-0 !pt-4 text-center"
                                        )}
                                    >
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
