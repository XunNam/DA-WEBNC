Main scope-creep risks:

- turning Batch 2 into a custom admin page
- adding admin custom components for preview/open before proving they are necessary
- widening the change beyond [Media.ts](D:/Đồ án/DA-WEBNC/src/collections/Media.ts)
- touching delete lifecycle even though Batch 1 already passed
- widening into orphan cleanup, where-used tracing, or media architecture redesign
- altering Book or Author deletion semantics

Required risk controls:

- keep the initial implementation centered on one file: [Media.ts](D:/Đồ án/DA-WEBNC/src/collections/Media.ts)
- change only collection admin config
- leave upload/storage/delete logic untouched
- leave frontend and public routes untouched
- treat built-in Payload upload edit/delete behavior as the default path unless a true blocker is found

Stop conditions for the later code-writing turn:

- if implementation appears to require changes outside [Media.ts](D:/Đồ án/DA-WEBNC/src/collections/Media.ts)
- if a custom admin component or custom page seems necessary just to land Batch 2
- if changing list/search config unexpectedly affects R2 deletion behavior
- if the built-in upload document UI proves unusable in a way that would require a broader admin customization

If a stop condition is hit:

- halt
- report the blocker clearly
- do not silently widen the patch into custom admin UI work
