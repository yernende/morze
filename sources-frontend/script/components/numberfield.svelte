<div class="numberfield">
  <button on:click="{decreaseValue}" class="numberfield-button numberfield-button-left" {disabled}>◀</button>
  <input on:blur="{confirmInputValue}" class="numberfield-display" value={value} {disabled}>
  <button on:click="{increaseValue}" class="numberfield-button numberfield-button-right" {disabled}>▶</button>
</div>

<script>
  export let min = 0;
  export let max = 1000;
  export let step = 1;
  export let value = 0;
  export let disabled = false;

  function decreaseValue(event) {
    if (value - step >= min) {
      value -= step;
    } else {
      value = min;
    }

    event.target.blur();
  }

  function increaseValue(event) {
    if (value + step <= max) {
      value += step;
    } else {
      value = max;
    }

    event.target.blur();
  }

  function confirmInputValue(event) {
    value = parseInt(event.target.value);
    if (isNaN(value)) value = min;
    event.target.value = value;

    if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }
  }
</script>
