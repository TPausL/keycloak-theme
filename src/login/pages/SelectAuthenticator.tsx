import type { PageProps } from "keycloakify/login/pages/PageProps";
import { clsx } from "keycloakify/tools/clsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

function getAuthIconClass(iconCssClass?: string, displayName?: string): string {
    const raw = `${iconCssClass ?? ""} ${displayName ?? ""}`.toLowerCase();
    if (raw.includes("webauthn") || raw.includes("passkey") || raw.includes("key")) {
        return "pi pi-key";
    }
    if (raw.includes("otp") || raw.includes("mobile") || raw.includes("phone") || raw.includes("totp")) {
        return "pi pi-mobile";
    }
    if (raw.includes("password") || raw.includes("lock")) {
        return "pi pi-lock";
    }
    return "pi pi-shield";
}

export default function SelectAuthenticator(props: PageProps<Extract<KcContext, { pageId: "select-authenticator.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, auth } = kcContext;

    const { msg, advancedMsg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo={false}
            headerNode={msg("loginChooseAuthenticator")}
        >
            <form id="kc-select-credential-form" className="mt-2" action={url.loginAction} method="post">
                <div className="flex flex-col gap-3">
                    {auth.authenticationSelections.map((authenticationSelection, i) => (
                        <button
                            key={i}
                            type="submit"
                            name="authenticationExecution"
                            value={authenticationSelection.authExecId}
                            className="group w-full flex items-center gap-3.5 rounded-lg bg-[#243b67] hover:bg-[#172b4d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172b4d] border border-white/20 hover:border-white/50 p-3.5 text-left text-gray-100 shadow-md transition-all cursor-pointer"
                        >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#172b4d] text-[#fbb140] group-hover:bg-[#fb6340] group-hover:text-[#172b4d] transition-colors">
                                <i
                                    className={clsx(
                                        getAuthIconClass(authenticationSelection.iconCssClass, authenticationSelection.displayName),
                                        "text-lg"
                                    )}
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-100 group-hover:text-white">
                                    {advancedMsg(authenticationSelection.displayName)}
                                </div>
                                <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{advancedMsg(authenticationSelection.helpText)}</div>
                            </div>
                            <div className="shrink-0 pl-1">
                                <i
                                    className="pi pi-chevron-right text-gray-400 group-hover:text-[#fb6340] group-hover:translate-x-0.5 transition-all text-sm"
                                    aria-hidden="true"
                                />
                            </div>
                        </button>
                    ))}
                </div>
            </form>
        </Template>
    );
}
