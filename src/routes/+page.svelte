<script lang="ts">
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
	import { enhance } from '$app/forms'

	export let form;

	let mediaRecorder: MediaRecorder | undefined = undefined;
	let filesElement: HTMLInputElement;

	let chunks: Blob[] = [];

	let isLoading: boolean = false

	const beforeSubmit = async () => {
		isLoading = true;
	}

	const afterSubmit = async () => {
		isLoading = false;
		filesElement.files = new DataTransfer().files
		chunks = [];
	}

	const startRecord = async () => {
		try {
			const devices = await navigator.mediaDevices.enumerateDevices()
			
			const device = devices[0]

			console.dir(device)

			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				peerIdentity: device.deviceId
			});

			mediaRecorder = new MediaRecorder(stream);

			mediaRecorder.ondataavailable = (event) => {
				chunks.push(event.data);
			}

			mediaRecorder.onstart = async (_) => {
				console.trace('onstart media record')
			}

			mediaRecorder.onstop = async (_) => {
				console.trace('onstop media record')

				const transfer = new DataTransfer()
				transfer.items.add(new File([...chunks], 'filename.ogg', { type: 'audio/ogg; codecs=opus' }))

				if (filesElement.files) {
					for (let i = 0; i< filesElement.files.length; i++) {
						transfer.items.add(filesElement.files.item(i)!)
					}
				}

				filesElement.files = transfer.files
			}

			filesElement.files = new DataTransfer().files
			chunks = [];
			mediaRecorder?.start()
		} catch (e) {
			console.error(e)
		}
	}

	const stopRecord = () => {
		try {
			mediaRecorder?.stop();
			mediaRecorder = undefined;
		} catch (e) {
			console.error(e)
		}
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcome_fallback} alt="Welcome" />
			</picture>
		</span>

		
	</h1>
	{#if isLoading}
		<h3> Loading </h3>
	{/if}

	<div>
		{#if mediaRecorder == null}
		<button on:click={startRecord}>録音開始</button>
		{:else}
		<button on:click={stopRecord}>停止</button>
		{/if}
	

		<button on:click={()=>{
			const file = filesElement.files?.item(0)

			if (file) {
				const a = document.createElement('a')
				a.href = window.URL.createObjectURL(file)
				a.download = 'sample.ogg'
				a.click();
			}
		}}>自分の声をダウンロード</button>
		<form method="POST" action="?/send" enctype="multipart/form-data" use:enhance={()=>{
			beforeSubmit();

			return async ({ update }) => {
				await update();
				afterSubmit();
			}
		}}>
			<input style="display: none;" name="voice" type="file" accept="audio/ogg" bind:this={filesElement}>
			<button type="submit">送る</button>

		</form>
			{#if (form?.message)}
				{form?.message}
			{/if}
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
