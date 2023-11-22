# Browser Media Stream

ブラウザからマイクを起動、音声ファイルをダウンロードするデモアプリ

## 参考にしたURL
- https://developer.mozilla.org/ja/docs/Web/API/MediaDevices/getUserMedia
- https://developer.mozilla.org/ja/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.