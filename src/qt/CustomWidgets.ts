import { Direction, FocusPolicy, QBoxLayout, QFrame, QGridLayout, QScrollArea, QWidget } from "@nodegui/nodegui";

export abstract class ScrollPanel extends QScrollArea {
  centralWidget: QWidget;
  vLayout: QBoxLayout;

  widgets: QWidget[] = [];

  constructor() {
    super();
    this.setInlineStyle(`
      background: rgba(0, 0, 0, 0);
      border: none;
    `)
    this.centralWidget = new QFrame();
    this.centralWidget.setInlineStyle(`
      background: rgba(0, 0, 0, 0);
    `);
    // this.setVerticalScrollBarPolicy(ScrollBarPolicy.ScrollBarAlwaysOn);
    this.setWidgetResizable(true);
    this.setWidget(this.centralWidget);
    this.vLayout = new QBoxLayout(Direction.TopToBottom);
    const a = 12;
    this.vLayout.setContentsMargins(a, a, a, a);
    this.vLayout.setSpacing(0);
    this.centralWidget.setLayout(this.vLayout);

    this.fill();

    this.vLayout.addStretch(1);
  }

  refill() {
    for(const component of this.widgets) {
      // component.hide();
      component.close();
      // component.nodeParent = null;
      // this.vLayout.removeWidget(component);
    }
    this.widgets = [];
    this.fill();
  }

  addWidget(widget: QWidget) {
    this.widgets.push(widget);
    this.vLayout.insertWidget(0, widget);
  }

  abstract fill(): void;
}

export abstract class GridItem extends QFrame {

  rootLayout: QGridLayout;

  get layout(): QGridLayout {
    return this.rootLayout;
  }

  constructor() {
    super();

    this.rootLayout = new QGridLayout()
    this.setLayout(this.rootLayout);
    this.setInlineStyle(`
      width: '100%';
      margin: 0px;
      padding: 0px;
    `);
    this.rootLayout.setContentsMargins(0, 0, 0, 0);
    this.rootLayout.setSpacing(0);
    this.rootLayout.setVerticalSpacing(0);
    this.rootLayout.setHorizontalSpacing(0);
    // this.rootLayout.

    this.setFocusPolicy(FocusPolicy.ClickFocus);
  }
}