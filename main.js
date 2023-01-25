const getImgPath = (d) => {
    return `img/${d.object_name}_${d.object_id}_[${d.end_time}].jpg`
}

const secondsToMinutes = (seconds) => {
    let minutes = Math.floor(seconds / 60)
    seconds = seconds % 60
    return `${minutes}m ${seconds}s`
}


d3.csv("data/catalogue.csv", (d) => d).then(function(data) {

    const root = d3.select("#showcase")

    // add total duration of each object
    let groups = d3.groups(data, (d) => d.object_name)
                   .map((d) => [d[0], d[1], d[1].length])
                   .map((d) => [d[0], d[1], d[2], d3.sum(d[1], (d) => d.duration)])
                   .map((d) => [d[0], d[1].sort((a, b) => b.duration - a.duration).slice(0, 100), d[2], d[3]])
                   .sort((a, b) => d3.sum(b[1], (d) => d.duration) - d3.sum(a[1], (d) => d.duration))
                   .forEach((d) => {

        let group = root.append("div").attr("class", "group")
        
        let text = group.append("div").attr("class", "text")
        let scrollBox = group.append("div").attr("class", "scrollBox")
        let collection = scrollBox.append("div").attr("class", "images")

        d[1].forEach((d, i) => {
            // We take only the first 100 images to avoid turning our RAM into a toaster
            if (i > 100) return
            let container = collection
                                .append("div")
                                .attr("class", "container")
                                .append("a")
                                .attr("href", getImgPath(d))
                
            let images = container
                            .append("img")
                            .attr("src", getImgPath(d))
                            .attr("height", d.duration * 3)
                            .attr("alt", `${d.object_name}_${d.object_id}`)

            /// === TOOLTIP === ///
            images
                .on("mouseover", function(e) {
                    let parent = d3.select(this.parentNode.parentNode.parentNode)

                    d3.select(this)
                    .attr("height", `${parent.node().getBoundingClientRect().height}px`)

                    d3.select('body')
                        .append("div")
                        .attr("class", "tooltip")
                        .style("top", (e.pageY - 10) + "px")
                        .style("left", (e.pageX + 10) + "px")
                        .text(`Object appears for ${secondsToMinutes(Math.round(d.duration))}`)
                })
                .on("mouseout", function() {
                    d3.select('body').selectAll(".tooltip").remove()
                    d3.select(this).attr("height", d.duration * 3)

                })
        })

        text.append("h2")
            .text(d[0])
            .style("text-transform", "capitalize")
            .style("font-size", "2em")
            .style("margin-bottom", "0.2em")

        text.append("p")
            .text(`${d[2]} images`)
            .style("font-size", "1em")
            .style("margin-top", "0em")
            .style("margin-bottom", "0.2em")

        text.append("p")
            .text(`${secondsToMinutes(Math.round(d[3]))} total screen time`)
            .style("font-size", "1em")
            .style("margin-top", "0em")
            .style("margin-bottom", "1.2em")
                        
    })
})