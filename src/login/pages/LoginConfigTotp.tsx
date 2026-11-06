import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { FloatLabel } from "primereact/floatlabel";

export default function LoginConfigTotp(props: PageProps<Extract<KcContext, { pageId: "login-config-totp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, isAppInitiatedAction, totp, mode, messagesPerField } = kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    const [totpCode, setTotpCode] = useState("");
    const [userLabel, setUserLabel] = useState("");
    const [logoutSessions, setLogoutSessions] = useState(false);

    const hasTotpError = messagesPerField.existsError("totp");
    const hasLabelError = messagesPerField.existsError("userLabel");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("loginTotpTitle")}
            displayMessage={!messagesPerField.existsError("totp", "userLabel")}
        >
            <div className="pt-2">
                <ol id="kc-totp-settings" className="list-decimal pl-5 space-y-3 text-sm text-[#172b4d] font-medium mb-6">
                    <li>
                        <p className="m-0 mb-1">{msg("loginTotpStep1")}</p>
                        <ul id="kc-totp-supported-apps" className="list-disc pl-5 text-xs text-[#172b4d]/85 space-y-0.5">
                            {totp.supportedApplications.map(app => (
                                <li key={app}>{advancedMsg(app)}</li>
                            ))}
                        </ul>
                    </li>

                    {mode === "manual" ? (
                        <>
                            <li>
                                <p className="m-0 mb-1.5">{msg("loginTotpManualStep2")}</p>
                                <div className="my-2 rounded-lg bg-[#243b67] border border-[#172b4d] p-2.5 text-center">
                                    <span id="kc-totp-secret-key" className="font-mono text-sm text-white tracking-wider select-all">
                                        {totp.totpSecretEncoded}
                                    </span>
                                </div>
                                <p className="m-0">
                                    <a
                                        href={totp.qrUrl}
                                        id="mode-barcode"
                                        className="text-xs font-bold text-[#172b4d] underline underline-offset-4 hover:text-[#111827]"
                                    >
                                        {msg("loginTotpScanBarcode")}
                                    </a>
                                </p>
                            </li>
                            <li>
                                <p className="m-0 mb-1">{msg("loginTotpManualStep3")}</p>
                                <ul className="list-disc pl-5 text-xs text-[#172b4d]/85 space-y-0.5">
                                    <li id="kc-totp-type">
                                        {msg("loginTotpType")}: {msg(`loginTotp.${totp.policy.type}`)}
                                    </li>
                                    <li id="kc-totp-algorithm">
                                        {msg("loginTotpAlgorithm")}: {totp.policy.getAlgorithmKey()}
                                    </li>
                                    <li id="kc-totp-digits">
                                        {msg("loginTotpDigits")}: {totp.policy.digits}
                                    </li>
                                    {totp.policy.type === "totp" ? (
                                        <li id="kc-totp-period">
                                            {msg("loginTotpInterval")}: {totp.policy.period}
                                        </li>
                                    ) : (
                                        <li id="kc-totp-counter">
                                            {msg("loginTotpCounter")}: {totp.policy.initialCounter}
                                        </li>
                                    )}
                                </ul>
                            </li>
                        </>
                    ) : (
                        <li>
                            <p className="m-0 mb-2">{msg("loginTotpStep2")}</p>
                            <div className="flex flex-col items-center my-3">
                                <div className="bg-white p-2.5 rounded-xl shadow-md inline-block">
                                    <img
                                        id="kc-totp-secret-qr-code"
                                        src={`data:image/png;base64, ${totp.totpSecretQrCode}`}
                                        alt="Figure: Barcode"
                                        className="block max-w-[160px] max-h-[160px]"
                                    />
                                </div>
                                <a
                                    href={totp.manualUrl}
                                    id="mode-manual"
                                    className="mt-2 text-xs font-bold text-[#172b4d] underline underline-offset-4 hover:text-[#111827]"
                                >
                                    {msg("loginTotpUnableToScan")}
                                </a>
                            </div>
                        </li>
                    )}

                    <li>
                        <p className="m-0">{msg("loginTotpStep3")}</p>
                        <p className="m-0 text-xs text-[#172b4d]/80 mt-0.5">{msg("loginTotpStep3DeviceName")}</p>
                    </li>
                </ol>

                <form action={url.loginAction} className={kcClsx("kcFormClass") + " pt-2"} id="kc-totp-settings-form" method="post">
                    <div className="mb-7">
                        <FloatLabel>
                            <InputText
                                type="text"
                                id="totp"
                                name="totp"
                                value={totpCode}
                                onChange={e => setTotpCode(e.target.value)}
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck={false}
                                className="w-full text-lg font-mono tracking-widest text-gray-100"
                                invalid={hasTotpError}
                                aria-describedby={hasTotpError ? "input-error-otp-code" : undefined}
                            />
                            <label htmlFor="totp">{msg("authenticatorCode")} *</label>
                        </FloatLabel>

                        {hasTotpError && (
                            <div
                                id="input-error-otp-code"
                                className="mt-2 flex items-center gap-2 rounded-md bg-[#1e355e]/95 px-3 py-2 text-xs font-medium text-red-100 border border-red-300/60 shadow-sm"
                                aria-live="polite"
                            >
                                <i className="pi pi-exclamation-circle text-red-300 shrink-0" aria-hidden="true" />
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.get("totp"))
                                    }}
                                />
                            </div>
                        )}
                        <input type="hidden" id="totpSecret" name="totpSecret" value={totp.totpSecret} />
                        {mode && <input type="hidden" id="mode" value={mode} />}
                    </div>

                    <div className="mb-5">
                        <FloatLabel>
                            <InputText
                                type="text"
                                id="userLabel"
                                name="userLabel"
                                value={userLabel}
                                onChange={e => setUserLabel(e.target.value)}
                                autoComplete="off"
                                className="w-full text-base text-gray-100"
                                invalid={hasLabelError}
                                aria-describedby={hasLabelError ? "input-error-otp-label" : undefined}
                            />
                            <label htmlFor="userLabel">
                                {msg("loginTotpDeviceName")}
                                {totp.otpCredentials.length >= 1 ? " *" : ""}
                            </label>
                        </FloatLabel>

                        {hasLabelError && (
                            <div
                                id="input-error-otp-label"
                                className="mt-2 flex items-center gap-2 rounded-md bg-[#1e355e]/95 px-3 py-2 text-xs font-medium text-red-100 border border-red-300/60 shadow-sm"
                                aria-live="polite"
                            >
                                <i className="pi pi-exclamation-circle text-red-300 shrink-0" aria-hidden="true" />
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.get("userLabel"))
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="my-5">
                        <div className="flex items-center">
                            <Checkbox
                                inputId="logout-sessions"
                                name="logout-sessions"
                                value="on"
                                checked={logoutSessions}
                                onChange={e => setLogoutSessions(e.checked ?? false)}
                            />
                            <label htmlFor="logout-sessions" className="ml-2 mb-0 text-sm font-medium text-[#172b4d] cursor-pointer select-none">
                                {msg("logoutOtherSessions")}
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5 mt-4">
                        <Button
                            type="submit"
                            className="w-full text-gray-100 font-semibold"
                            id="saveTOTPBtn"
                            label={msgStr("doSubmit")}
                            severity="secondary"
                            size="large"
                            raised
                        />
                        {isAppInitiatedAction && (
                            <Button
                                type="submit"
                                className="w-full text-gray-200"
                                id="cancelTOTPBtn"
                                name="cancel-aia"
                                value="true"
                                label={msgStr("doCancel")}
                                severity="secondary"
                                outlined
                            />
                        )}
                    </div>
                </form>
            </div>
        </Template>
    );
}
