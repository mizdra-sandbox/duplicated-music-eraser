# duplicated-music-eraser

音楽ライブラリから重複するファイルを見つけてライブラリから除去してくれる君。

```console
$ yarn install
$ # <target-library>: 重複ファイルを含む音楽ライブラリのパス
$ # <saving-dir>: 重複ファイルを追いやるディレクトリのパス
$ yarn run start <target-library> <to>
```

## Example

```console
$ yarn run start '~/Music/iTunes/iTunes Media' ~/Music/duplicated-music
$ # duplicated-music に重複ファイルが追いやられていることを確認
$ ls ~/Music/duplicated-music
$ # 問題なければ手動で削除
$ rm -rf ~/Music/duplicated-music
```
