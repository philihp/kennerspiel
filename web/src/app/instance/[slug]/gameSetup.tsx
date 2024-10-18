export const GameSetup = () => {
  return <form>
    <legend>
      <input type="radio" name="country" id="france" value="France" />
      <label htmlFor="france">France</label>
      <input type="radio" name="country" value="Ireland" id="ireland" />
      <label htmlFor="ireland">Ireland</label>
    </legend>
  </form>
}
