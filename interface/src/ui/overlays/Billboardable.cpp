//
//  Billboardable.cpp
//  interface/src/ui/overlays
//
//  Created by Zander Otavka on 8/7/15.
//  Copyright 2014 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

#include "Billboardable.h"

#include <Application.h>
#include <Transform.h>
#include "avatar/AvatarManager.h"

void Billboardable::setProperties(const QVariantMap& properties) {
    auto isFacingAvatar = properties["isFacingAvatar"];
    if (isFacingAvatar.isValid()) {
        setIsFacingAvatar(isFacingAvatar.toBool());
    }
}

QVariant Billboardable::getProperty(const QString &property) {
    if (property == "isFacingAvatar") {
        return isFacingAvatar();
    }
    return QVariant();
}

bool Billboardable::pointTransformAtCamera(Transform& transform, glm::quat offsetRotation) {
    if (isFacingAvatar()) {
        glm::vec3 billboardPos = transform.getTranslation();
        glm::vec3 cameraPos = qApp->getCamera().getPosition();
        
        glm::vec3 avatarUP = DependencyManager::get<AvatarManager>()->getMyAvatar()->getOrientation()*Vectors::UP;
        
        glm::quat rotation(conjugate(toQuat(glm::lookAt(billboardPos, cameraPos, avatarUP))));
        
        transform.setRotation(rotation);
        transform.postRotate(offsetRotation);
        return true;
    }
    return false;
}
