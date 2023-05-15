export const JSONViewer = (obj) => (
  <div style={{ padding: "20px", border: "1px solid red", marginLeft: "50px" }}>
    <pre>{JSON.stringify(obj, null, 2)}</pre>
  </div>
);
