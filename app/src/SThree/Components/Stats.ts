import Stats_three from 'three/examples/jsm/libs/stats.module'
export default class Stats {
    main;
    constructor(main) {
        this.main = main;
        main.stats = new Stats_three();
        main.stats.setMode(0);
        main.stats.domElement.style.position = 'absolute';
        main.stats.domElement.style.left = '0';
        main.stats.domElement.style.top = '0';
        
        document.getElementById("three").appendChild(main.stats.dom)
        main.addToRender('Stats', this);
    }
    render() {
        this.main.stats.update();
    }
}
