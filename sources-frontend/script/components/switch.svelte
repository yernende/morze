<button on:click="{handleButtonClick}" class="switch" {disabled}>{value ? "ВКЛ" : "ВЫКЛ"}</button>

<script>
  export let value = false;
  export let disabled = false;

  function handleButtonClick(event) {
    value = !value;
    event.target.blur();
  }
</script>
