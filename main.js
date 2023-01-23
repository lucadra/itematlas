// add svg to the showcase div
// make the div full width and height

//var svg = d3.select("#showcase").append("svg")
//.attr("width", "100%")
//.attr("height", "100%");

const getImgPath = (d) => {
    return `img/${d.object_name}_${d.object_id}_[${d.end_time}].jpg`
}

// load csv from data folder and display it in the showcase div
d3.csv("data/catalogue.csv", (d) => d).then(function(data) {
    console.log(data);
    var list = d3.select("#showcase").append("ul");
    
    data.forEach((d, i) => {
        console.log(d)
        // append an image to the svg for the first 25 items
        if (i < 100) {
            list.append("li").append("img")
            .attr("src", getImgPath(d))
            .attr("x", 0)
            .attr("y", i * 50)
            .attr("height", d.duration*2);
        }
    });
})