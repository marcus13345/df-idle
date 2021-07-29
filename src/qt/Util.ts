import { AlignmentFlag, QGridLayout, QLabel } from "@nodegui/nodegui";


export function addSplitText(layout: QGridLayout, left: string, right: string, row: number) {
  layout.setSpacing(0);

  const nameLabel = new QLabel();
  nameLabel.setText(left);
  nameLabel.setAlignment(AlignmentFlag.AlignLeft | AlignmentFlag.AlignTop);
  // nameLabel.setInlineStyle('padding: 0px; margin: 0px;');
  const activityLabel = new QLabel();
  activityLabel.setText(right);
  activityLabel.setAlignment(AlignmentFlag.AlignRight | AlignmentFlag.AlignTop);
  // activityLabel.setInlineStyle('padding: 0px; margin: 0px;');

  layout.addWidget(nameLabel, row, 0, 1, 1);
  layout.addWidget(activityLabel, row, 1, 1, 1);
  layout.setRowStretch(row, 1);

  // in theory this is redundant, calling this
  // function on the same layout multiple times...
  layout.setColumnStretch(0, 1);
  layout.setColumnStretch(1, 1);
}