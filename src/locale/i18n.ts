import { koMessages, type MessageId } from "@locale/messages/ko";

type KoDictionary = typeof koMessages;

export type { MessageId } from "@locale/messages/ko";

/** 현재는 ko만 로드. 다음 단계에서 locale 스위치 시 messages 매핑만 확장하면 된다. */
function activeMessages(): typeof koMessages {
  return koMessages;
}

function formatTemplate(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_m, key: string) => {
    const v = vars[key];
    return v !== undefined && v !== null ? String(v) : `{{${key}}}`;
  });
}

export function t(
  id: MessageId,
  vars?: Record<string, string | number>,
): string {
  const raw = activeMessages()[id as keyof KoDictionary];
  if (raw === undefined) {
    return String(id);
  }
  return formatTemplate(raw, vars);
}
