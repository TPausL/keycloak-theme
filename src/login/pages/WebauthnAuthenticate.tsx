import { Fragment } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useScript } from "keycloakify/login/pages/WebauthnAuthenticate.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function WebauthnAuthenticate(props: PageProps<Extract<KcContext, { pageId: "webauthn-authenticate.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { url, realm, registrationDisabled, authenticators, shouldDisplayAuthenticators } = kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    const authButtonId = "authenticateWebAuthnButton";

    useScript({
        authButtonId,
        kcContext,
        i18n
    });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo={realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div id="kc-registration" className="text-sm">
                    <span className="text-[#172b4d]/90 font-medium">
                        {msg("noAccount")}{" "}
                        <a
                            tabIndex={6}
                            href={url.registrationUrl}
                            className="font-bold text-[#172b4d] underline underline-offset-4 hover:text-[#111827] transition-colors"
                        >
                            {msg("doRegister")}
                        </a>
                    </span>
                </div>
            }
            headerNode={msg("webauthn-login-title")}
        >
            <div id="kc-form-webauthn" className={clsx(kcClsx("kcFormClass"), "pt-2")}>
                <form id="webauth" action={url.loginAction} method="post">
                    <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                    <input type="hidden" id="authenticatorData" name="authenticatorData" />
                    <input type="hidden" id="signature" name="signature" />
                    <input type="hidden" id="credentialId" name="credentialId" />
                    <input type="hidden" id="userHandle" name="userHandle" />
                    <input type="hidden" id="error" name="error" />
                </form>

                <div>
                    {authenticators && (
                        <>
                            <form id="authn_select" className={kcClsx("kcFormClass")}>
                                {authenticators.authenticators.map(authenticator => (
                                    <input key={authenticator.credentialId} type="hidden" name="authn_use_chk" value={authenticator.credentialId} />
                                ))}
                            </form>

                            {shouldDisplayAuthenticators && (
                                <>
                                    {authenticators.authenticators.length > 1 && (
                                        <p className="text-sm font-semibold text-[#172b4d] mb-2.5">{msg("webauthn-available-authenticators")}</p>
                                    )}
                                    <div className="flex flex-col gap-2.5 mb-5">
                                        {authenticators.authenticators.map((authenticator, i) => (
                                            <div
                                                key={i}
                                                id={`kc-webauthn-authenticator-item-${i}`}
                                                className="flex items-center gap-3.5 rounded-lg bg-[#243b67] border border-[#172b4d] p-3.5 text-gray-100 shadow-sm"
                                            >
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#172b4d] text-[#fbb140]">
                                                    <i className="pi pi-key text-base" aria-hidden="true" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div
                                                        id={`kc-webauthn-authenticator-label-${i}`}
                                                        className="text-sm font-semibold text-white truncate"
                                                    >
                                                        {advancedMsg(authenticator.label)}
                                                    </div>
                                                    {authenticator.transports.displayNameProperties?.length ? (
                                                        <div id={`kc-webauthn-authenticator-transport-${i}`} className="text-xs text-gray-300 mt-0.5">
                                                            {authenticator.transports.displayNameProperties
                                                                .map((displayNameProperty, idx, arr) => ({
                                                                    displayNameProperty,
                                                                    hasNext: idx !== arr.length - 1
                                                                }))
                                                                .map(({ displayNameProperty, hasNext }) => (
                                                                    <Fragment key={displayNameProperty}>
                                                                        {advancedMsg(displayNameProperty)}
                                                                        {hasNext && <span>, </span>}
                                                                    </Fragment>
                                                                ))}
                                                        </div>
                                                    ) : null}
                                                    <div className="text-xs text-gray-300 mt-0.5">
                                                        <span id={`kc-webauthn-authenticator-createdlabel-${i}`}>
                                                            {msg("webauthn-createdAt-label")}{" "}
                                                        </span>
                                                        <span id={`kc-webauthn-authenticator-created-${i}`}>{authenticator.createdAt}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    <div id="kc-form-buttons" className="mt-4">
                        <input
                            id={authButtonId}
                            type="button"
                            autoFocus
                            value={msgStr("webauthn-doAuthenticate")}
                            className="p-button p-component p-button-secondary p-button-raised p-button-lg w-full justify-center font-semibold text-white cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </Template>
    );
}
