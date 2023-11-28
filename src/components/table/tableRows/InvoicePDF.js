import React, { useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
const styles = {
  invoiceContainer: {
    width: "100vh", // Set width to 100% to fit within the A4 page
    fontFamily: "Arial, sans-serif",
    border: "1px solid #ccc",
    padding: "2vh", // Reduce padding for the container
  },
  header: {
    fontSize: "28px",
    textAlign: "center",
    margin: "20px 0",
  },
  paragraph: {
    fontSize: "14px",
    margin: "5px 0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    margin: "20px",
  },
  tableHead: {
    backgroundColor: "#3498db",
    color: "#fff",
  },
  tableRow: {
    borderBottom: "1px solid #ccc",
  },
  tableCell: {
    padding: "10px",
    textAlign: "left",
    border: "1px solid #ccc",
  },
  buttonsContainer: {
    textAlign: "center",
    marginTop: "20px",
  },
  actionButton: {
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    margin: "0 10px",
  },
  labelCell: {
    padding: "3px",
    textAlign: "left",
    fontWeight: "bold",
    width: "30%",
  },
  labelfortheCustomer: {
    padding: "3px",
    textAlign: "left",
    fontWeight: "bold",
    width: "8vh",
  },
  contentCell: {
    padding: "3px",
    border: "1px  black",
    textAlign: "left",
    width: "70%",
  },
  contentCellforthecustomer: {
    padding: "3px",
    border: "1px  black",
    textAlign: "left",
    // width: "70%",
  },
  companyDetails: {
    fontSize: "14px",
    marginBottom: "10px",
  },
};

const InvoicePDF = ({ row }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const invoiceRef = React.useRef();
  console.log(row, "here inside in the invoice pdf");
  // const handlePrint = useReactToPrint({
  //   content: () => invoiceRef.current,
  //   onBeforeGetContent: () => {
  //     setIsPrinting(true);
  //   },
  //   onAfterPrint: () => {
  //     setIsPrinting(false);
  //   },
  // });
  useEffect(() => {
    GeneratePDF(); // Call handleDownload function when the component is mounted
  }, [row]);

  const customPageSize = {
    width: 1090,
    height: 1600,
  };

  const GeneratePDF = () => {
    // var doc = new jsPDF("p", "pt", "a4");
    var doc = new jsPDF({
      unit: "pt",
      format: [customPageSize.width, customPageSize.height],
    });

    var content = document.getElementById(`dawnloadPdf`);
    doc.html(content, {
      x: 10,
      y: 10,
      callback: function (pdf) {
        pdf.save("invoice.pdf");
      },
    });
  };
  const dateString = row?.createdAt;
  const dateObject = new Date(dateString);
  const day = dateObject.getDate().toString().padStart(2, "0");
  const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObject.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  <td style={styles.tableCell}>{formattedDate}</td>;

  return (
    <div>
      <div ref={invoiceRef} id={"dawnloadPdf"}>
        <div style={{ ...styles.invoiceContainer }}>
          <div style={styles.header}>Invoice</div>
          <div style={styles.companyDetails}>
            <p>Company Name: TakeMonks</p>
            <p>Address: Company Address, City, State, Zip Code</p>
            <p>Contact: +1 (123) 456-7890 | Email: info@takemonks.com</p>
          </div>
          <hr
            style={{ height: "10px", border: "none", backgroundColor: "#ccc" }}
          ></hr>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <table
              style={{
                margin: "10px",
                borderRadius: "10px",
              }}
            ></table>

            <div
              style={{
                width: "50vh",
                border: "1px solid #ccc",
                margin: "10px",
                borderRadius: "10px",
              }}
            >
              <table>
                <tbody>
                  <tr>
                    <td style={styles.labelCell}>Invoice Number:</td>
                    <td style={styles.contentCell}>{row._id}</td>
                  </tr>
                  <tr>
                    <td style={styles.labelCell}>Date </td>
                    <td style={styles.contentCell}>{formattedDate}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ margin: "10px" }}>
            <h3>Customer Details</h3>
            <hr></hr>
            <table
              style={{
                margin: "10px",
                border: "1px #ccc solid",
                borderRadius: "10px",
                width: "100%",
              }}
            >
              <tbody>
                <tr style={{ display: "flex" }}>
                  <div style={styles.labelfortheCustomer}>
                    <b>Name </b>
                  </div>
                  <div style={styles.contentCellforthecustomer}>
                    {row.user.fullName}
                  </div>
                </tr>
                <tr style={{ display: "flex" }}>
                  <div style={styles.labelfortheCustomer}>
                    <b>Email </b>
                  </div>
                  <div style={styles.contentCellforthecustomer}>
                    {row.user.email}
                  </div>
                </tr>
                <tr style={{ display: "flex" }}>
                  <div style={styles.labelfortheCustomer}>
                    <b>Phone</b>
                  </div>
                  <div style={styles.contentCellforthecustomer}>
                    {row.user.phone}
                  </div>
                </tr>
                <tr style={{ display: "flex" }}>
                  <div style={styles.labelfortheCustomer}>
                    <b>GST </b>
                  </div>
                  <div style={styles.contentCellforthecustomer}>
                    {row.user.gst}
                  </div>
                </tr>
              </tbody>
            </table>
            <table
              style={{
                margin: "10px",
                border: "1px #ccc solid",
                borderRadius: "10px",
                width: "100%",
              }}
            >
              <tbody>
                <tr>
                  <td colSpan="2">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ width: "48%" }}>
                        <h4>Shipping Address</h4>
                        <hr />
                        <table>
                          <tbody>
                            <tr>
                              <td style={styles.labelCell}>Address</td>
                              <td>{row.user.address}</td>
                            </tr>
                            <tr>
                              <td style={styles.labelCell}>City</td>
                              <td>{row.user.city}</td>
                            </tr>
                            <tr>
                              <td style={styles.labelCell}>State</td>
                              <td>{row.user.state}</td>
                            </tr>
                            <tr>
                              <td style={styles.labelCell}>Postal Code</td>
                              <td>{row.user.zip}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div style={{ width: "48%" }}>
                        <h4>Billing Address</h4>
                        <hr />
                        <table>
                          <tbody>
                            <tr>
                              <td style={styles.labelCell}>Address</td>
                              <td style={styles.contentCell}>
                                {row.user.billingAddressField}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.labelCell}>City</td>
                              <td style={styles.contentCell}>
                                {row.user.billingCity}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.labelCell}>State</td>
                              <td style={styles.contentCell}>
                                {row.user.billingState}
                              </td>
                            </tr>
                            <tr>
                              <td style={styles.labelCell}>Postal Code</td>
                              <td style={styles.contentCell}>
                                {row.user.billingZip}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3>Order Details</h3>
          <hr></hr>
          <table style={{ ...styles.table, margin: "10px auto" }}>
            <thead style={styles.tableHead}>
              <tr>
                <th style={styles.tableCell}>Product Name</th>
                <th style={styles.tableCell}>Quantity</th>
                <th style={styles.tableCell}>Price</th>
                <th style={styles.tableCell}>Inventory Type</th>
                <th style={styles.tableCell}>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {row.amcsItems.map((product, index) => (
                <tr key={index} style={styles.tableRow}>
                  <td style={styles.tableCell}>{product.name}</td>
                  <td style={styles.tableCell}>{product.quantity}</td>
                  <td style={styles.tableCell}>{product.priceSale}</td>
                  <td style={styles.tableCell}>{product.producttype}</td>
                  <td style={styles.tableCell}>{formattedDate}</td>
                </tr>
              ))}
              {row.items.map((product, index) => (
                <tr key={index} style={styles.tableRow}>
                  <td style={styles.tableCell}>{product.name}</td>
                  <td style={styles.tableCell}>{product.quantity}</td>
                  <td style={styles.tableCell}>{product.priceSale}</td>
                  <td style={styles.tableCell}>{product.producttype}</td>
                  <td style={styles.tableCell}>{formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table style={{ ...styles.table }}>
            <tbody>
              <tr>
                <td>
                  <b>Sub Total:</b>
                </td>
                <td>{row.subTotal}</td>
              </tr>
              <tr>
                <td>
                  <b>Shipping Charges:</b>
                </td>
                <td>{row.shipping}</td>
              </tr>
              <tr>
                <td>
                  <b>Total:</b>
                </td>
                <td>
                  <b>{row.total}</b>
                </td>
              </tr>
            </tbody>
          </table>
          <hr
            style={{ height: "10px", border: "none", backgroundColor: "#ccc" }}
          ></hr>
          <div
            style={{
              border: "1px solid #ccc",
              color: "#ccc",
              display: "flex",
              margin: "10px",
            }}
          >
            <div style={{ marginRight: "250px", marginLeft: "10px" }}>
              <p>Email: info@takemonks.in</p>
            </div>
            <div>
              <p>Contact: +1 (123) 456-7890</p>
            </div>
          </div>
        </div>
      </div>
      {/* <div style={styles.buttonsContainer}>
        {!isPrinting && (
          <button style={styles.actionButton} onClick={GeneratePDF}>
            Print Invoice
          </button>
        )}
      </div> */}
    </div>
  );
};
export default InvoicePDF;
