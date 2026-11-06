import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Message } from "primereact/message";
import { Button } from "primereact/button";

export default function Info(props: PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { advancedMsgStr, msg } = i18n;

    const { messageHeader, message, requiredActions, skipLink, pageRedirectUri, actionUri, client } = kcContext;

    const targetAction = (() => {
        if (skipLink) {
            return null;
        }
        if (pageRedirectUri) {
            return { href: pageRedirectUri, node: msg("backToApplication") };
        }
        if (actionUri) {
            return { href: actionUri, node: msg("proceedWithAction") };
        }
        if (client.baseUrl) {
            return { href: client.baseUrl, node: msg("backToApplication") };
        }
        return null;
    })();

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={
                <span
                    dangerouslySetInnerHTML={{
                        __html: kcSanitize(messageHeader ? advancedMsgStr(messageHeader) : message.summary)
                    }}
                />
            }
        >
            <div id="kc-info-message" className="pt-2">
                <Message
                    severity="info"
                    className="w-full justify-start text-left text-sm mb-5"
                    text={
                        <span
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(
                                    (() => {
                                        let html = message.summary?.trim() ?? "";
                                        if (requiredActions) {
                                            html += " <b>";
                                            html += requiredActions
                                                .map(requiredAction => advancedMsgStr(`requiredAction.${requiredAction}`))
                                                .join(", ");
                                            html += "</b>";
                                        }
                                        return html;
                                    })()
                                )
                            }}
                        />
                    }
                />
                {targetAction && (
                    <div className="mt-4">
                        <Button
                            severity="secondary"
                            className="w-full justify-center text-gray-100 font-semibold"
                            raised
                            onClick={() => {
                                window.location.href = targetAction.href;
                            }}
                        >
                            {targetAction.node}
                        </Button>
                    </div>
                )}
            </div>
        </Template>
    );
}
