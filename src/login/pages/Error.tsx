import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Message } from "primereact/message";
import { Button } from "primereact/button";

export default function Error(props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { message, client, skipLink } = kcContext;
    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("errorTitle")}
        >
            <div id="kc-error-message" className="pt-2">
                <Message
                    severity="error"
                    className="w-full justify-start text-left text-sm mb-5"
                    text={<span dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />}
                />
                {!skipLink && !!client?.baseUrl && (
                    <div className="mt-4">
                        <Button
                            id="backToApplication"
                            severity="secondary"
                            className="w-full justify-center text-gray-100 font-semibold"
                            raised
                            onClick={() => {
                                window.location.href = client.baseUrl!;
                            }}
                        >
                            {msg("backToApplication")}
                        </Button>
                    </div>
                )}
            </div>
        </Template>
    );
}
