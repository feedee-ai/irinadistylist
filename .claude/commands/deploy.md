---
description: Задеплоить сайт на Vercel (прод или превью) и вернуть ссылку
argument-hint: "[prod|preview]"
---

Задеплой сайт из этого репо на Vercel. Режим: `$ARGUMENTS` (пусто = prod).

Порядок:

1. Проверь чистоту дерева: всё закоммичено и запушено в текущую ветку (`git status`, `git push -u origin <branch>`).
2. Проверь доступ: `vercel whoami --token "$VERCEL_TOKEN"`.
   - Нет `VERCEL_TOKEN` или `api.vercel.com` закрыт сетью → не пытайся обходить. Скажи Александру одной строкой, что добавить в настройках облачной среды (переменная `VERCEL_TOKEN`, домены `api.vercel.com`, `vercel.com` в allowlist), и остановись.
3. Если проект ещё не залинкован (`.vercel/project.json` нет): `vercel link --yes --token "$VERCEL_TOKEN"` (имя проекта = имя репо). Затем `vercel git connect --yes --token "$VERCEL_TOKEN"`, чтобы дальше пуш в `main` деплоил сам.
4. Деплой:
   - prod: `vercel deploy --prod --yes --token "$VERCEL_TOKEN"`
   - preview: `vercel deploy --yes --token "$VERCEL_TOKEN"`
5. Проверь, что ссылка отвечает 200 (`curl -sI`), и верни Александру: URL, что задеплоено (коммит), режим.

Никогда без явного «да» от Александра: `vercel remove/rm`, `vercel domains rm`, `vercel env rm`, `vercel rollback`, `gh repo delete`, force-push. `.vercel/` в git не коммить.
