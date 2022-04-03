{#if initialized}
  <div class="device">
    <div class="dashboard">
      <div class="dashboard-label">Линия</div>
      <Numberfield min={1} max={14} step={1} bind:value={channel} disabled={transmitting} />
      <div class="dashboard-label">Частота звука</div>
      <Numberfield min={100} max={1000} step={40} bind:value={frequency} />
      <div class="dashboard-label">Сглаживание</div>
      <Switch bind:value={antialiasing} disabled={transmitting} />
      <div class="dashboard-label">Приём</div>
      <Lamp value={receiving} />
      <div class="dashboard-label">Передача</div>
      <Lamp value={transmitting} />
    </div>
  </div>
{:else}
  <div class="initialize-request">
    Нажмите любую клавишу для инициализации
  </div>
{/if}

<svelte:window on:keydown={handleWindowKeydown} on:keyup={handleWindowKeyup} />
<svelte:body on:mousedown={handleWindowMousedown} on:mouseup={handleWindowMouseup} />

<script>
  import { onMount } from "svelte";
  import Numberfield from "./components/numberfield.svelte";
  import Switch from "./components/switch.svelte";
  import Lamp from "./components/lamp.svelte";

  import sound from "./sound.js";
  import transceiver from "./transceiver.js";

  let channel = parseInt(localStorage.getItem("channel")) || 1;
  let frequency = parseInt(localStorage.getItem("frequency")) || 440;
  let antialiasing = localStorage.getItem("antialiasing") == "true" || false;

  let initialized = false;
  let receiving = false;
  let transmitting = false;

  $: sound.setFrequency(frequency);
  $: sound.setAntialising(antialiasing);
  $: transceiver.subscribe(channel);
  $: checkSound(receiving, transmitting);

  $: localStorage.setItem("channel", channel);
  $: localStorage.setItem("frequency", frequency);
  $: localStorage.setItem("antialiasing", antialiasing);

  function checkSound(receiving, transmitting) {
    if (receiving || transmitting) {
      sound.start();
    } else {
      sound.stop();
    }
  }

  function initialize() {
    sound.init();
    transceiver.allowConnection();

    transceiver.onReceptionGoing = () => {
      receiving = true;
    };

    transceiver.onReceptionEnd = () => {
      receiving = false;
    };

    initialized = true;
  }

  function handleWindowKeydown(event) {
    if (!initialized) {
      if (event.keyCode != 116) initialize();
      return;
    }

    if (event.target.nodeName != "INPUT" && event.target.nodeName != "BUTTON") {
      transceiver.startTransmission();
      transmitting = true;
    };
  }

  function handleWindowKeyup(event) {
    if (!initialized) return;

    transceiver.stopTransmission();
    transmitting = false;
  }

  function handleWindowMousedown(event) {
    if (event.button == 0) {
      handleWindowKeydown(event);
    }
  }

  function handleWindowMouseup(event) {
    if (event.button == 0) {
      handleWindowKeyup(event);
    }
  }
</script>
