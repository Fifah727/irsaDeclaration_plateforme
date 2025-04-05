import React, { useEffect, useRef, useState } from "react";

import axios from "axios";
import { Container, Button } from "react-bootstrap";
import { FaPrint } from "react-icons/fa";
import { Row, Col} from "react-bootstrap";
import Aside from "../components/Aside";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf"
import { Calendar,ConfigProvider , Badge, Modal} from "antd";

import "antd/dist/reset.css";

import * as d3 from "d3";


const IrsaChart = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Année actuelle par défaut
    const [data, setData] = useState({}); // Stocker les données structurées par année
    const [error, setError] = useState(null); // Stocker les erreurs éventuelles
    const userId = localStorage.getItem("userId");
    const chartRef = useRef(null);


  // État pour contrôler la visibilité du Sidebar
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  // Fonction pour basculer l'état
  const toggleSidebar = () => {
      setSidebarVisible(!isSidebarVisible);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/declarations/${userId}`);
        const rawData = response.data;

        // Transformation des données pour ne garder que le mois, l'année et le montant total
        const structuredData = rawData.reduce((acc, row) => {
          const { moisDec, anneeDec, irsaDu } = row;

          // Calculer le montant total (revenuBase + toutCotis + avantage)
          const amount = irsaDu;

          if (!acc[anneeDec]) acc[anneeDec] = [];
          acc[anneeDec].push({ month: moisDec, amount }); // Ajouter le mois et le montant
          return acc;
        }, {});

        setData(structuredData); // Stocker les données formatées
      } catch (err) {
        setError("Erreur lors de la récupération des déclarations.");
        console.error("Erreur API :", err);
      }
    };

    fetchData();
  }, [userId]);

  // Mettre à jour le graphique D3 lorsque l'année ou les données changent
  useEffect(() => {
    const currentData = data[selectedYear] || []; // Get the data for the selected year

    // Dimensions of the chart (responsive)
    const width = chartRef.current.offsetWidth || 900;
    const height = chartRef.current.offsetHeight || 500;
    const margin = { top: 40, right: 20, bottom: 50, left: 50 };

    // Remove any existing chart before recreating
    d3.select(chartRef.current).select("svg").remove();

    // Create the SVG container
    const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "linear-gradient(90deg, #1a202c, #2d3748)") // Elegant gradient background
        .style("border-radius", "10px")
        .style("padding", "10px")
        .style("box-shadow", "0 5px 15px rgba(0, 0, 0, 0.3)");

    // Define the scales
    const xScale = d3
    .scaleBand()
    .domain(currentData.map((d) => d.month))
    .range([margin.left, width - margin.right - 50]) // Réduisez la plage totale
    .padding(0.5);


    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(currentData, (d) => d.amount) || 0]) // Domain for Y based on data or default to 0
        .range([height - margin.bottom, margin.top]);

    // Add X-axis
    svg
        .append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickSize(0))
        .selectAll("text")
        .attr("fill", "white") // White color for text
        .style("font-size", "12px")
        .style("font-weight", "bold");

    // Add Y-axis
    svg
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).ticks(5).tickSize(-width + margin.left + margin.right))
        .selectAll("text")
        .attr("fill", "white") // White color for Y-axis labels
        .style("font-size", "12px")
        .style("font-weight", "bold");

    // Add horizontal grid lines
    svg
        .selectAll(".tick line")
        .attr("stroke", "#4a5568")
        .attr("stroke-dasharray", "2,2");

    // Tooltip container
    const tooltip = d3
        .select(chartRef.current)
        .append("div")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.7)")
        .style("color", "white")
        .style("padding", "8px 12px")
        .style("border-radius", "8px")
        .style("opacity", 0)
        .style("pointer-events", "none")
        .style("font-size", "14px");

        svg
        .selectAll("rect")
        .data(currentData)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.month))
        .attr("y", height - margin.bottom) // Démarrage à la base du graphique
        .attr("width", xScale.bandwidth())
        .attr("height", 0) // Hauteur initiale
        .attr("fill", "url(#gradient)")
        .transition() // Animation des barres
        .duration(1000)
        .ease(d3.easeCubicOut)
        .attr("y", (d) => yScale(d.amount))
        .attr("height", (d) => height - margin.bottom - yScale(d.amount));
    
    svg.selectAll("rect") // Interactions avec les barres
        .on("mouseover", function (event, d) {
            d3.select(this)
                .transition()
                .duration(300)
                .attr("fill", "#4FD1C5");
    
            tooltip
                .style("opacity", 1)
                .html(`<strong>${d.month} ${selectedYear}</strong>: ${d.amount} Ar`)
                .style("left", `${event.pageX - chartRef.current.getBoundingClientRect().left}px`)
                .style("top", `${event.pageY - chartRef.current.getBoundingClientRect().top - 40}px`);
        })
        .on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(300)
                .attr("fill", "url(#gradient)");
    
            tooltip.style("opacity", 0);
        });
    
    // Gradient fill for bars
    const defs = svg.append("defs");
    defs
        .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%")
        .selectAll("stop")
        .data([
            { offset: "0%", color: "#0D6EFD" },
            { offset: "100%", color: "#2A69AC" },
        ])
        .enter()
        .append("stop")
        .attr("offset", (d) => d.offset)
        .attr("stop-color", (d) => d.color);

    // Add labels inside the bars
    svg
        .selectAll("text.label")
        .data(currentData)
        .enter()
        .append("text")
        .attr("className", "label")
        .attr("x", (d) => xScale(d.month) + xScale.bandwidth() / 2)
        .attr("y", (d) => yScale(d.amount) + 20)
        .attr("text-anchor", "middle")
        .text((d) => `${d.amount}`)
        .style("fill", "white")
        .style("font-size", "12px");


    

    if (currentData.length === 0) {
        // Show a message when there's no data
        svg
            .append("text")
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .text(`Aucune donnée pour ${selectedYear}`)
            .style("fill", "white")
            .style("font-size", "18px")
            .style("font-weight", "bold");
    }
}, [selectedYear, data]);
// useEffect(() => {
//   const currentData = data[selectedYear] || []; // Données pour l'année sélectionnée

//   // Dimensions du graphique (responsives)
//   const width = Math.max(chartRef.current.offsetWidth, 400); // Largeur minimale pour petits écrans
//   const height = Math.max(chartRef.current.offsetHeight, 300); // Hauteur minimale
//   const margin = { top: 40, right: 20, bottom: 50, left: 50 };

//   // Supprimer tout graphique existant avant de recréer
//   d3.select(chartRef.current).select("svg").remove();

//   // Créer le conteneur SVG
//   const svg = d3
//       .select(chartRef.current)
//       .append("svg")
//       .attr("width", width)
//       .attr("height", height)
//       .style("background", "linear-gradient(90deg, #1a202c, #2d3748)") // Fond élégant
//       .style("border-radius", "10px")
//       .style("padding", "10px")
//       .style("box-shadow", "0 5px 15px rgba(0, 0, 0, 0.3)");

//   // Échelles X et Y
//   const xScale = d3
//       .scaleBand()
//       .domain(currentData.map((d) => d.month))
//       .range([margin.left, width - margin.right])
//       .padding(0.3); // Espace entre les barres ajusté

//   const yScale = d3
//       .scaleLinear()
//       .domain([0, d3.max(currentData, (d) => d.amount) || 0])
//       .range([height - margin.bottom, margin.top]);

//   // Ajout des axes
//   svg.append("g")
//       .attr("transform", `translate(0, ${height - margin.bottom})`)
//       .call(d3.axisBottom(xScale).tickSize(0))
//       .selectAll("text")
//       .attr("fill", "white")
//       .style("font-size", "12px")
//       .style("font-weight", "bold");

//   svg.append("g")
//       .attr("transform", `translate(${margin.left}, 0)`)
//       .call(d3.axisLeft(yScale).ticks(5).tickSize(-width + margin.left + margin.right))
//       .selectAll("text")
//       .attr("fill", "white")
//       .style("font-size", "12px")
//       .style("font-weight", "bold");

//   // Lignes de grille horizontales
//   svg.selectAll(".tick line")
//       .attr("stroke", "#4a5568")
//       .attr("stroke-dasharray", "2,2");

//   // Conteneur de tooltip
//   const tooltip = d3
//       .select(chartRef.current)
//       .append("div")
//       .style("position", "absolute")
//       .style("background", "rgba(0, 0, 0, 0.7)")
//       .style("color", "white")
//       .style("padding", "8px 12px")
//       .style("border-radius", "8px")
//       .style("opacity", 0)
//       .style("pointer-events", "none")
//       .style("font-size", "14px");

//   // Barres avec animations
//   svg.selectAll("rect")
//       .data(currentData)
//       .enter()
//       .append("rect")
//       .attr("x", (d) => xScale(d.month))
//       .attr("y", height - margin.bottom) // Les barres commencent à 0
//       .attr("width", xScale.bandwidth())
//       .attr("height", 0)
//       .attr("fill", "url(#gradient)")
//       .transition()
//       .duration(800) // Animation fluide
//       .attr("y", (d) => yScale(d.amount))
//       .attr("height", (d) => height - margin.bottom - yScale(d.amount));

//   // Ajout des interactions hover pour les barres
//   svg.selectAll("rect")
//       .on("mouseover", function (event, d) {
//           d3.select(this)
//               .transition()
//               .duration(300)
//               .attr("fill", "#4FD1C5"); // Couleur lors du survol

//           tooltip
//               .style("opacity", 1)
//               .html(`<strong>${d.month} ${selectedYear}</strong>: ${d.amount} Ar`)
//               .style("left", `${event.pageX - chartRef.current.getBoundingClientRect().left}px`)
//               .style("top", `${event.pageY - chartRef.current.getBoundingClientRect().top - 40}px`);
//       })
//       .on("mouseout", function () {
//           d3.select(this)
//               .transition()
//               .duration(300)
//               .attr("fill", "url(#gradient)");

//           tooltip.style("opacity", 0);
//       });

//   // Dégradé de couleur pour les barres
//   const defs = svg.append("defs");
//   defs.append("linearGradient")
//       .attr("id", "gradient")
//       .attr("x1", "0%")
//       .attr("y1", "0%")
//       .attr("x2", "0%")
//       .attr("y2", "100%")
//       .selectAll("stop")
//       .data([{ offset: "0%", color: "#0D6EFD" }, { offset: "100%", color: "#2A69AC" }])
//       .enter()
//       .append("stop")
//       .attr("offset", (d) => d.offset)
//       .attr("stop-color", (d) => d.color);

//   // Labels des barres
//   svg.selectAll("text.label")
//       .data(currentData)
//       .enter()
//       .append("text")
//       .attr("class", "label")
//       .attr("x", (d) => xScale(d.month) + xScale.bandwidth() / 2)
//       .attr("y", (d) => yScale(d.amount) - 10)
//       .attr("text-anchor", "middle")
//       .text((d) => `${d.amount}`)
//       .style("fill", "white")
//       .style("font-size", "12px");

//   // Afficher un message si aucune donnée
//   if (currentData.length === 0) {
//       svg.append("text")
//           .attr("x", width / 2)
//           .attr("y", height / 2)
//           .attr("text-anchor", "middle")
//           .text(`Aucune donnée pour ${selectedYear}`)
//           .style("fill", "white")
//           .style("font-size", "18px")
//           .style("font-weight", "bold");
//   }
// }, [selectedYear, data]);


  // Fonctions pour changer l'année sélectionnée
  const handlePreviousYear = () => {
    setSelectedYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    setSelectedYear((prev) => prev + 1);
  };

  const handleExportToPDF = async () => {
    const element = chartRef.current; // Référence au conteneur du graphique
    const canvas = await html2canvas(element, {
        scale: 2, // Augmente la qualité de l'image
        useCORS: true, // Gère les ressources externes
    });
    const imgData = canvas.toDataURL("image/png", 1.0);

    const pdf = new jsPDF("landscape", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Ajouter un en-tête
    pdf.setFontSize(16);
    pdf.setTextColor(40);
    pdf.text("Rapport Graphique IRSA", pdfWidth / 2, 10, { align: "center" });
    pdf.setFontSize(12);
    pdf.text(`Année sélectionnée : ${selectedYear}`, pdfWidth / 2, 20, { align: "center" });

    // Ajouter le graphique
    pdf.addImage(imgData, "PNG", 10, 30, pdfWidth - 20, pdfHeight);

    // // Ajouter une bordure autour de l'image
    // pdf.setDrawColor(0);
    // pdf.setLineWidth(0.5);
    // pdf.rect(10, 30, pdfWidth - 20, pdfHeight);

    // Ajouter des notes ou des observations
    pdf.setFontSize(12);
    pdf.setTextColor(50);
  
    // Ajouter un pied de page
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Généré par Mon Application - ${new Date().toLocaleDateString()}`, pdfWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: "center" });

    // Enregistrer le fichier PDF
    pdf.save(`Graphique_IRSA_${selectedYear}.pdf`);
};


  return (
    <div
      style={{
          backgroundColor: "rgb(245, 245, 250)", // Bright background
      }}
    >
      <Container fluid>
        <Row>
          {/* Sidebar (Aside) */}
          {isSidebarVisible && (
              <Col md={2} className="p-0 bg-light sidebar">
                  <Aside />
              </Col>
          )}

            {/* Bouton pour cacher/afficher l'Aside */}
          <Col md={isSidebarVisible ? 10 : 12} className="p-4 main-content">
            <main id="main" className="main" style={{
                padding: "30px 30px 20px 30px",
            
            }}>
              {/* Form Section */}
              <section className="section">
                  <Row>
                  <Container
                          style={{
                              // maxWidth: "1100px",
                              backgroundColor: "white", // White card background for contrast
                              padding: "30px",
                              
                          }}
                  >
                    <Button
                        variant="primary"
                        onClick={toggleSidebar}
                        style={{
                            marginBottom: "40px",
                            float:"left",
                            borderRadius : "30px"
                        }}
                    >
                      <i
                          className={isSidebarVisible ? "bi bi-arrow-left" : "bi bi-arrow-right"}
                          style={{
                              fontSize: "1.5rem",
                          }}
                      ></i>
                    </Button>

                    <div
                      id="calendar-container"
                    >
                        <h1
                        style={{
                          textAlign:"right",
                          marginBottom: "30px",
                          fontSize: "23px",
                          color: "#1890ff",
                          fontWeight: "bold",
                        }}
                      >
                        Montant IRSA par Mois de {selectedYear}
                      </h1>

                      <div style={{ textAlign: "center", color: "white" }}>
                        {/* <h2 style={{ color: "#0D6EFD", marginBottom: "20px" }}>Année : {selectedYear}</h2> */}
                        <div style={{ marginBottom: "30px"}}>
                          <div class="btn-group" role="group" aria-label="Basic outlined example">
                            <button type="button" onClick={handlePreviousYear} class="btn btn-outline-dark">Année Précédente</button>
                            <button type="button" onClick={handleNextYear} class="btn btn-outline-dark">Année Suivante</button>
                            <button onClick={handleExportToPDF} class="btn btn-success">
                              Imprimer
                            </button>
                          </div>
                         
                        </div>

                        <div ref={chartRef} style={{ position: "relative" }}></div>
                      </div>
                    </div>

                  </Container>
                </Row>
              </section>
            </main>
          </Col>
        </Row>
      </Container>
    </div>
       
  );
};

export default IrsaChart;


// import React, { useEffect, useRef, useState } from "react";
//  import axios from "axios";
//  import { Container, Button } from "react-bootstrap";
//  import { FaPrint } from "react-icons/fa";
//  import { Row, Col } from "react-bootstrap";
//  import Aside from "../components/Aside";
//  import html2canvas from "html2canvas";
//  import { jsPDF } from "jspdf";
//  import { Calendar, ConfigProvider, Badge, Modal } from "antd";
//  import "antd/dist/reset.css";
//  import * as d3 from "d3";

//  const IrsaChart = () => {
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Année actuelle par défaut
//   const [data, setData] = useState({}); // Stocker les données structurées par année
//   const [error, setError] = useState(null); // Stocker les erreurs éventuelles
//   const userId = localStorage.getItem("userId");
//   const chartRef = useRef(null);

//   // État pour contrôler la visibilité du Sidebar
//   const [isSidebarVisible, setSidebarVisible] = useState(true);
//   // Fonction pour basculer l'état
//   const toggleSidebar = () => {
//    setSidebarVisible(!isSidebarVisible);
//   };

//   useEffect(() => {
//    const fetchData = async () => {
//     try {
//      const response = await axios.get(`http://localhost:5000/declarations/${userId}`);
//      const rawData = response.data;

//      // Transformation des données pour ne garder que le mois, l'année et le montant total
//      const structuredData = rawData.reduce((acc, row) => {
//       const { moisDec, anneeDec, irsaDu } = row;

//       // Calculer le montant total (revenuBase + toutCotis + avantage)
//       const amount = irsaDu;

//       if (!acc[anneeDec]) acc[anneeDec] = [];
//       acc[anneeDec].push({ month: moisDec, amount }); // Ajouter le mois et le montant
//       return acc;
//      }, {});

//      setData(structuredData); // Stocker les données formatées
//     } catch (err) {
//      setError("Erreur lors de la récupération des déclarations.");
//      console.error("Erreur API :", err);
//     }
//    };

//    fetchData();
//   }, [userId]);

//   // Mettre à jour le graphique D3 lorsque l'année ou les données changent
//   useEffect(() => {
//    const currentData = data[selectedYear] || []; // Get the data for the selected year

//    // Dimensions of the chart (responsive)
//    const width = chartRef.current ? chartRef.current.offsetWidth : 900;
//    const height = 500;
//    const margin = { top: 40, right: 50, bottom: 60, left: 60 };
//    const innerWidth = width - margin.left - margin.right;
//    const innerHeight = height - margin.top - margin.bottom;

//    // Remove any existing chart before recreating
//    d3.select(chartRef.current).select("svg").remove();

//    // Create the SVG container
//    const svg = d3
//     .select(chartRef.current)
//     .append("svg")
//     .attr("width", width)
//     .attr("height", height)
//     .style("background-color", "#f9f9f9") // Light grey background
//     .style("border-radius", "8px")
//     .style("box-shadow", "0 2px 4px rgba(0, 0, 0, 0.1)");

//    const g = svg
//     .append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);

//    // Define the scales
//    const xScale = d3
//     .scaleBand()
//     .domain(currentData.map((d) => d.month))
//     .range([0, innerWidth])
//     .padding(0.1);

//    const yScale = d3
//     .scaleLinear()
//     .domain([0, d3.max(currentData, (d) => d.amount) || 0]) // Domain for Y based on data or default to 0
//     .range([innerHeight, 0]);

//    // Add X-axis
//    g.append("g")
//     .attr("transform", `translate(0, ${innerHeight})`)
//     .call(d3.axisBottom(xScale))
//     .selectAll("text")
//     .style("text-anchor", "middle")
//     .style("font-size", "12px")
//     .style("color", "#333");

//    // Add Y-axis
//    g.append("g")
//     .call(d3.axisLeft(yScale).ticks(5))
//     .selectAll("text")
//     .style("font-size", "12px")
//     .style("color", "#333");

//    // Add labels to the axes
//    g.append("text")
//     .attr("x", innerWidth / 2)
//     .attr("y", innerHeight + margin.bottom - 10)
//     .style("text-anchor", "middle")
//     .style("font-size", "14px")
//     .style("color", "#555")
//     .text("Mois");

//    g.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", -margin.left + 20)
//     .attr("x", -innerHeight / 2)
//     .attr("dy", "0.71em")
//     .style("text-anchor", "middle")
//     .style("font-size", "14px")
//     .style("color", "#e2e8f0")
    
//    // Tooltip container
//    const tooltip = d3
//     .select("body")
//     .append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0)
//     .style("position", "absolute")
//     .style("background-color", "rgba(0, 0, 0, 0.8)")
//     .style("color", "white")
//     .style("padding", "8px")
//     .style("border-radius", "4px")
//     .style("font-size", "12px")
//     .style("pointer-events", "none");

//    g.selectAll(".bar")
//     .data(currentData)
//     .enter()
//     .append("rect")
//     .attr("class", "bar")
//     .attr("x", (d) => xScale(d.month))
//     .attr("y", (d) => yScale(d.amount))
//     .attr("width", xScale.bandwidth())
//     .attr("height", (d) => innerHeight - yScale(d.amount))
//     .attr("fill", "#1890ff") // Primary blue color
//     .on("mouseover", function (event, d) {
//      tooltip.transition().duration(200).style("opacity", 0.9);
//      tooltip
//       .html(`<strong>${d.month}</strong><br/>Montant: ${d.amount} Ar`)
//       .style("left", event.pageX + 10 + "px")
//       .style("top", event.pageY - 25 + "px");
//      d3.select(this).style("opacity", 0.8);
//     })
//     .on("mouseout", function () {
//      tooltip.transition().duration(500).style("opacity", 0);
//      d3.select(this).style("opacity", 1);
//     });

//    if (currentData.length === 0) {
//     g.append("text")
//      .attr("x", innerWidth / 2)
//      .attr("y", innerHeight / 2)
//      .attr("text-anchor", "middle")
//      .style("font-size", "16px")
//      .style("color", "#777")
//      .text(`Aucune donnée pour ${selectedYear}`);
//    }
//   }, [selectedYear, data]);

//   // Fonctions pour changer l'année sélectionnée
//   const handlePreviousYear = () => {
//    setSelectedYear((prev) => prev - 1);
//   };

//   const handleNextYear = () => {
//    setSelectedYear((prev) => prev + 1);
//   };

//   const handleExportToPDF = async () => {
//    const element = chartRef.current; // Référence au conteneur du graphique
//    const canvas = await html2canvas(element, {
//     scale: 2, // Augmente la qualité de l'image
//     useCORS: true, // Gère les ressources externes
//    });
//    const imgData = canvas.toDataURL("image/png", 1.0);

//    const pdf = new jsPDF("landscape", "mm", "a4");
//    const pdfWidth = pdf.internal.pageSize.getWidth();
//    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//    // Ajouter un en-tête
//    pdf.setFontSize(16);
//    pdf.setTextColor(40);
//    pdf.text("Rapport Graphique IRSA", pdfWidth / 2, 10, { align: "center" });
//    pdf.setFontSize(12);
//    pdf.text(`Année sélectionnée : ${selectedYear}`, pdfWidth / 2, 20, { align: "center" });

//    // Ajouter le graphique
//    pdf.addImage(imgData, "PNG", 10, 30, pdfWidth - 20, pdfHeight);

//    // // Ajouter une bordure autour de l'image
//    // pdf.setDrawColor(0);
//    // pdf.setLineWidth(0.5);
//    // pdf.rect(10, 30, pdfWidth - 20, pdfHeight);

//    // Ajouter des notes ou des observations
//    pdf.setFontSize(12);
//    pdf.setTextColor(50);

//    // Ajouter un pied de page
//    pdf.setFontSize(10);
//    pdf.setTextColor(100);
//    pdf.text(`Généré par Mon Application - ${new Date().toLocaleDateString()}`, pdfWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: "center" });

//    // Enregistrer le fichier PDF
//    pdf.save(`Graphique_IRSA_${selectedYear}.pdf`);
//   };

//   return (
//    <div
//     style={{
//      backgroundColor: "#f4f6f8", // Light, clean background
//      minHeight: "100vh",
//      display: "flex",
//     }}
//    >
//     {/* Sidebar (Aside) */}
//     {isSidebarVisible && (
//      <Col md={2} className="bg-light p-0" style={{ borderRight: "1px solid #e0e0e0" }}>
//       <Aside />
//      </Col>
//     )}

//     {/* Main Content */}
//     <Col md={isSidebarVisible ? 10 : 12} className="p-4">
//      <main id="main" className="main" style={{ padding: "20px" }}>
//       <section className="section dashboard">
//        <div className="d-flex justify-content-between align-items-center mb-4">
//         <Button
//          variant="outline-secondary"
//          onClick={toggleSidebar}
//          className="rounded-pill"
//          style={{ padding: "8px 16px" }}
//         >
//          <i className={isSidebarVisible ? "bi bi-arrow-left-short" : "bi bi-arrow-right-short"}></i>{" "}
//          {isSidebarVisible ? "Réduire" : "Afficher"}
//         </Button>
//        </div>

//        <div className="bg-white rounded shadow-sm p-4">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//          <h2 className="h6 mb-0" style={{ color: "#555", fontWeight: "bold" }}>
//           Montant IRSA par Mois - {selectedYear}
//          </h2>
//          <div className="btn-group" role="group" aria-label="Year Navigation">
//           <Button variant="outline-info" onClick={handlePreviousYear} size="sm">
//            <i className="bi bi-chevron-left"></i> Précédent
//           </Button>
//           <Button variant="outline-info" onClick={handleNextYear} size="sm">
//            Suivant <i className="bi bi-chevron-right"></i>
//           </Button>
//           <Button variant="success" onClick={handleExportToPDF} size="sm" className="ms-2">
//            <FaPrint /> Exporter PDF
//           </Button>
//          </div>
//         </div>
//         <div ref={chartRef} style={{ width: "100%", overflowX: "auto" }}>
//          {/* Le graphique D3 sera rendu ici */}
//         </div>
//         {error && <p className="text-danger mt-3">{error}</p>}
//        </div>
//       </section>
//      </main>
//     </Col>
//    </div>
//   );
//  };

//  export default IrsaChart;